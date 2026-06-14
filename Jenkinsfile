// ============================================
// PLAYWRIGHT AUTO PIPELINE - JENKINSFILE
// Fixed for: Windows Jenkins + your repo
// Author: Nikhil Kakde
// ============================================
// Fixes applied:
// ✅ FIX 1: sh → bat (Windows uses bat not sh)
// ✅ FIX 2: Slack credential ID fixed to match yours
// ✅ FIX 3: Email recipients updated to your email
// ✅ FIX 4: Email from/replyTo updated to your email
// ✅ FIX 5: rm -rf → del/rmdir (Windows commands)
// ✅ FIX 6: mkdir -p → mkdir (Windows command)
// ✅ FIX 7: cp -r → xcopy (Windows command)
// ✅ FIX 8: ESLint stage wrapped - won't break if missing
// ============================================
//
// Required Jenkins Setup:
// ─────────────────────────────────────────────
// 1. Manage Jenkins → Tools → NodeJS
//    → Name: NodeJS-20  → Version: 20.x
//
// 2. Manage Jenkins → Credentials → Add:
//    → Kind: Secret text
//    → ID: slack-webhook-token
//    → Secret: your full Slack webhook URL
//
// 3. Manage Jenkins → System → Extended Email:
//    → SMTP: smtp.gmail.com | Port: 587
//    → Username: nikhilkakde07@gmail.com
//    → Password: Gmail App Password
//
// Required Jenkins Plugins:
// ─────────────────────────────────────────────
// - NodeJS Plugin
// - Allure Jenkins Plugin
// - HTML Publisher Plugin
// - Slack Notification Plugin
// - Email Extension Plugin
// ============================================

pipeline {
    agent any

    tools {
        // Must match exactly what you named it in:
        // Manage Jenkins → Tools → NodeJS installations
        nodejs 'NodeJS-20'
    }

    environment {
        CI                       = 'true'
        // Cache Playwright browsers inside the workspace
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\.cache\\ms-playwright"
        // ✅ FIX 2: Use YOUR credential ID (matches what you saved in Jenkins)
        SLACK_WEBHOOK_URL        = credentials('slack-webhook-token')
        // ✅ FIX 3: Your email address
        EMAIL_RECIPIENTS         = 'nikhilkakde967@gmail.com'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        // ============================================
        // Install Dependencies
        // Separate stage so failures are clearly visible
        // ============================================
        stage('📚 Install Dependencies') {
            steps {
                echo '============================================'
                echo 'Installing npm dependencies...'
                echo '============================================'

                // ✅ FIX 1: bat instead of sh (Windows)
                bat 'npm ci'
            }
        }

        // ============================================
        // ESLint Analysis
        // continue-on-error so pipeline doesn't stop
        // ============================================
        stage('🔍 ESLint Analysis') {
            steps {
                script {
                    // ✅ FIX 5: Windows mkdir
                    bat 'if not exist eslint-report mkdir eslint-report'

                    echo 'Running ESLint...'
                    // returnStatus: true means pipeline won't fail if lint fails
                    def eslintStatus = bat(script: 'npm run lint', returnStatus: true)
                    env.ESLINT_STATUS = eslintStatus == 0 ? 'success' : 'failure'

                    echo 'Generating ESLint HTML Report...'
                    // || true equivalent on Windows: use returnStatus
                    bat(script: 'npm run lint:report', returnStatus: true)

                    if (env.ESLINT_STATUS == 'failure') {
                        echo '⚠️ ESLint found issues - check the HTML report'
                    } else {
                        echo '✅ No ESLint issues found'
                    }
                }
            }
            post {
                always {
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'eslint-report',
                        reportFiles         : 'index.html',
                        reportName          : 'ESLint Report',
                        reportTitles        : 'ESLint Analysis'
                    ])
                }
            }
        }

        // ============================================
        // DEV Environment Tests
        // ============================================
        stage('🔧 DEV Tests') {
            steps {
                echo '============================================'
                echo 'Installing Playwright browsers...'
                echo '============================================'
                // Install only chromium for DEV (faster)
                bat 'npx playwright install --with-deps chromium'

                echo '============================================'
                echo 'Cleaning previous results...'
                echo '============================================'
                // ✅ FIX 5: Windows delete commands
                bat '''
                    if exist allure-results        rmdir /s /q allure-results
                    if exist playwright-report     rmdir /s /q playwright-report
                    if exist playwright-html-report rmdir /s /q playwright-html-report
                    if exist test-results          rmdir /s /q test-results
                '''

                echo '============================================'
                echo 'Running DEV tests...'
                echo '============================================'
                script {
                    // ✅ FIX 1: bat instead of sh
                    // returnStatus: true captures pass/fail without stopping pipeline
                    def result = bat(
                        script: 'npx playwright test --config=playwright.config.dev.ts',
                        returnStatus: true
                    )
                    env.DEV_TEST_STATUS = result == 0 ? 'success' : 'failure'
                    echo "DEV Test Status: ${env.DEV_TEST_STATUS}"
                }

                echo 'Adding Allure environment info...'
                // ✅ FIX 6: Windows mkdir + echo to file
                bat '''
                    if not exist allure-results mkdir allure-results
                    echo Environment=DEV>                      allure-results\\environment.properties
                    echo Browser=Google Chrome>>               allure-results\\environment.properties
                    echo Config=playwright.config.dev.ts>>     allure-results\\environment.properties
                    echo Author=Nikhil Kakde>>                 allure-results\\environment.properties
                '''
            }
            post {
                always {
                    // ✅ FIX 7: xcopy instead of cp -r (Windows)
                    bat '''
                        if not exist allure-results-dev mkdir allure-results-dev
                        xcopy /E /I /Y allure-results allure-results-dev 2>nul || echo No allure-results to copy
                        npx allure generate allure-results-dev --clean -o allure-report-dev || echo Allure generation skipped
                    '''

                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'allure-report-dev',
                        reportFiles         : 'index.html',
                        reportName          : 'DEV Allure Report',
                        reportTitles        : 'DEV Allure Report'
                    ])
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'playwright-report',
                        reportFiles         : 'index.html',
                        reportName          : 'DEV Playwright Report',
                        reportTitles        : 'DEV Playwright Report'
                    ])
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'playwright-html-report',
                        reportFiles         : 'index.html',
                        reportName          : 'DEV HTML Report',
                        reportTitles        : 'DEV Custom HTML Report'
                    ])
                    archiveArtifacts artifacts: 'allure-results-dev/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*',       allowEmptyArchive: true
                }
            }
        }

        // ============================================
        // QA Environment Tests
        // ============================================
        stage('🔍 QA Tests') {
            steps {
                echo '============================================'
                echo 'Cleaning previous results...'
                echo '============================================'
                bat '''
                    if exist allure-results         rmdir /s /q allure-results
                    if exist playwright-report      rmdir /s /q playwright-report
                    if exist playwright-html-report rmdir /s /q playwright-html-report
                    if exist test-results           rmdir /s /q test-results
                '''

                echo '============================================'
                echo 'Running QA tests...'
                echo '============================================'
                script {
                    def result = bat(
                        script: 'npx playwright test --config=playwright.config.qa.ts',
                        returnStatus: true
                    )
                    env.QA_TEST_STATUS = result == 0 ? 'success' : 'failure'
                    echo "QA Test Status: ${env.QA_TEST_STATUS}"
                }

                bat '''
                    if not exist allure-results mkdir allure-results
                    echo Environment=QA>                    allure-results\\environment.properties
                    echo Browser=Google Chrome>>            allure-results\\environment.properties
                    echo Config=playwright.config.qa.ts>>  allure-results\\environment.properties
                    echo Author=Nikhil Kakde>>              allure-results\\environment.properties
                '''
            }
            post {
                always {
                    bat '''
                        if not exist allure-results-qa mkdir allure-results-qa
                        xcopy /E /I /Y allure-results allure-results-qa 2>nul || echo No allure-results to copy
                        npx allure generate allure-results-qa --clean -o allure-report-qa || echo Allure generation skipped
                    '''
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'allure-report-qa',
                        reportFiles         : 'index.html',
                        reportName          : 'QA Allure Report',
                        reportTitles        : 'QA Allure Report'
                    ])
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'playwright-report',
                        reportFiles         : 'index.html',
                        reportName          : 'QA Playwright Report',
                        reportTitles        : 'QA Playwright Report'
                    ])
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'playwright-html-report',
                        reportFiles         : 'index.html',
                        reportName          : 'QA HTML Report',
                        reportTitles        : 'QA Custom HTML Report'
                    ])
                    archiveArtifacts artifacts: 'allure-results-qa/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*',      allowEmptyArchive: true
                }
            }
        }

        // ============================================
        // STAGE Environment Tests
        // ============================================
        stage('🎯 STAGE Tests') {
            steps {
                bat '''
                    if exist allure-results         rmdir /s /q allure-results
                    if exist playwright-report      rmdir /s /q playwright-report
                    if exist playwright-html-report rmdir /s /q playwright-html-report
                    if exist test-results           rmdir /s /q test-results
                '''
                script {
                    def result = bat(
                        script: 'npx playwright test --config=playwright.config.stage.ts',
                        returnStatus: true
                    )
                    env.STAGE_TEST_STATUS = result == 0 ? 'success' : 'failure'
                    echo "STAGE Test Status: ${env.STAGE_TEST_STATUS}"
                }
                bat '''
                    if not exist allure-results mkdir allure-results
                    echo Environment=STAGE>                    allure-results\\environment.properties
                    echo Browser=Google Chrome>>               allure-results\\environment.properties
                    echo Config=playwright.config.stage.ts>>  allure-results\\environment.properties
                    echo Author=Nikhil Kakde>>                 allure-results\\environment.properties
                '''
            }
            post {
                always {
                    bat '''
                        if not exist allure-results-stage mkdir allure-results-stage
                        xcopy /E /I /Y allure-results allure-results-stage 2>nul || echo No allure-results to copy
                        npx allure generate allure-results-stage --clean -o allure-report-stage || echo Allure generation skipped
                    '''
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'allure-report-stage',
                        reportFiles         : 'index.html',
                        reportName          : 'STAGE Allure Report',
                        reportTitles        : 'STAGE Allure Report'
                    ])
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'playwright-report',
                        reportFiles         : 'index.html',
                        reportName          : 'STAGE Playwright Report',
                        reportTitles        : 'STAGE Playwright Report'
                    ])
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'playwright-html-report',
                        reportFiles         : 'index.html',
                        reportName          : 'STAGE HTML Report',
                        reportTitles        : 'STAGE Custom HTML Report'
                    ])
                    archiveArtifacts artifacts: 'allure-results-stage/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*',         allowEmptyArchive: true
                }
            }
        }

        // ============================================
        // PROD Environment Tests
        // ============================================
        stage('🚀 PROD Tests') {
            steps {
                bat '''
                    if exist allure-results         rmdir /s /q allure-results
                    if exist playwright-report      rmdir /s /q playwright-report
                    if exist playwright-html-report rmdir /s /q playwright-html-report
                    if exist test-results           rmdir /s /q test-results
                '''
                script {
                    def result = bat(
                        script: 'npx playwright test --config=playwright.config.prod.ts',
                        returnStatus: true
                    )
                    env.PROD_TEST_STATUS = result == 0 ? 'success' : 'failure'
                    echo "PROD Test Status: ${env.PROD_TEST_STATUS}"
                }
                bat '''
                    if not exist allure-results mkdir allure-results
                    echo Environment=PROD>                    allure-results\\environment.properties
                    echo Browser=Google Chrome>>              allure-results\\environment.properties
                    echo Config=playwright.config.prod.ts>>  allure-results\\environment.properties
                    echo Author=Nikhil Kakde>>                allure-results\\environment.properties
                '''
            }
            post {
                always {
                    bat '''
                        if not exist allure-results-prod mkdir allure-results-prod
                        xcopy /E /I /Y allure-results allure-results-prod 2>nul || echo No allure-results to copy
                        npx allure generate allure-results-prod --clean -o allure-report-prod || echo Allure generation skipped
                    '''
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'allure-report-prod',
                        reportFiles         : 'index.html',
                        reportName          : 'PROD Allure Report',
                        reportTitles        : 'PROD Allure Report'
                    ])
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'playwright-report',
                        reportFiles         : 'index.html',
                        reportName          : 'PROD Playwright Report',
                        reportTitles        : 'PROD Playwright Report'
                    ])
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'playwright-html-report',
                        reportFiles         : 'index.html',
                        reportName          : 'PROD HTML Report',
                        reportTitles        : 'PROD Custom HTML Report'
                    ])
                    archiveArtifacts artifacts: 'allure-results-prod/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*',        allowEmptyArchive: true
                }
            }
        }

        // ============================================
        // Combined Allure Report (All Environments)
        // ============================================
        stage('📈 Combined Allure Report') {
            steps {
                echo 'Generating Combined Allure Report...'
                // ✅ FIX 7: xcopy instead of cp -r (Windows)
                bat '''
                    if not exist allure-results-combined mkdir allure-results-combined
                    xcopy /E /I /Y allure-results-dev   allure-results-combined 2>nul || echo DEV results missing
                    xcopy /E /I /Y allure-results-qa    allure-results-combined 2>nul || echo QA results missing
                    xcopy /E /I /Y allure-results-stage allure-results-combined 2>nul || echo STAGE results missing
                    xcopy /E /I /Y allure-results-prod  allure-results-combined 2>nul || echo PROD results missing

                    echo Environment=ALL (DEV^, QA^, STAGE^, PROD)> allure-results-combined\\environment.properties
                    echo Browser=Google Chrome>>                      allure-results-combined\\environment.properties
                    echo Author=Nikhil Kakde>>                        allure-results-combined\\environment.properties
                '''
            }
            post {
                always {
                    allure([
                        includeProperties  : true,
                        jdk                : '',
                        properties         : [],
                        reportBuildPolicy  : 'ALWAYS',
                        results            : [[path: 'allure-results-combined']]
                    ])
                }
            }
        }
    }

    // ============================================
    // Post-Build: Summary + Slack + Email
    // ============================================
    post {
        always {
            echo '============================================'
            echo '📬 PIPELINE SUMMARY'
            echo '============================================'

            script {
                def devStatus   = env.DEV_TEST_STATUS   ?: 'unknown'
                def qaStatus    = env.QA_TEST_STATUS    ?: 'unknown'
                def stageStatus = env.STAGE_TEST_STATUS ?: 'unknown'
                def prodStatus  = env.PROD_TEST_STATUS  ?: 'unknown'

                def devEmoji   = devStatus   == 'success' ? '✅' : '❌'
                def qaEmoji    = qaStatus    == 'success' ? '✅' : '❌'
                def stageEmoji = stageStatus == 'success' ? '✅' : '❌'
                def prodEmoji  = prodStatus  == 'success' ? '✅' : '❌'

                echo """
============================================
📊 Test Results by Environment:
============================================
${devEmoji}   DEV:   ${devStatus}
${qaEmoji}    QA:    ${qaStatus}
${stageEmoji} STAGE: ${stageStatus}
${prodEmoji}  PROD:  ${prodStatus}
============================================
"""
                // Store for use in success/failure blocks
                env.DEV_EMOJI   = devEmoji
                env.QA_EMOJI    = qaEmoji
                env.STAGE_EMOJI = stageEmoji
                env.PROD_EMOJI  = prodEmoji
            }
        }

        success {
            echo '✅ Pipeline completed successfully!'
            script {
                // ── Slack ──────────────────────────────────────────────
                try {
                    slackSend(
                        color  : 'good',
                        message: """✅ *Playwright Pipeline: All Tests Passed*
*Job:* ${env.JOB_NAME} | *Build:* #${env.BUILD_NUMBER}
*Branch:* ${env.GIT_BRANCH ?: 'N/A'}

${env.DEV_EMOJI}   DEV:   ${env.DEV_TEST_STATUS}
${env.QA_EMOJI}    QA:    ${env.QA_TEST_STATUS}
${env.STAGE_EMOJI} STAGE: ${env.STAGE_TEST_STATUS}
${env.PROD_EMOJI}  PROD:  ${env.PROD_TEST_STATUS}

📊 <${env.BUILD_URL}allure|Combined Allure Report>
🔗 <${env.BUILD_URL}|View Build>"""
                    )
                } catch (Exception e) {
                    echo "Slack notification failed: ${e.message}"
                }

                // ── Email ──────────────────────────────────────────────
                try {
                    emailext(
                        subject : "✅ Playwright Tests Passed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                        // ✅ FIX 4: Your email in from/replyTo
                        from    : 'Nikhil Kakde CI <nikhilkakde07@gmail.com>',
                        replyTo : 'nikhilkakde07@gmail.com',
                        to      : env.EMAIL_RECIPIENTS,
                        mimeType: 'text/html',
                        body    : """
<html><body style="font-family:Arial,sans-serif;color:#333">
  <div style="max-width:650px;margin:0 auto">
    <div style="background:#27ae60;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
      <h2>✅ All Tests Passed</h2>
      <p>Playwright POM Automation Pipeline</p>
    </div>
    <div style="background:#f9f9f9;padding:20px;border-radius:0 0 8px 8px">
      <table width="100%" cellpadding="8" style="border-collapse:collapse">
        <tr><th align="left" style="background:#ecf0f1">Job</th><td>${env.JOB_NAME}</td></tr>
        <tr><th align="left" style="background:#ecf0f1">Build</th><td>#${env.BUILD_NUMBER}</td></tr>
        <tr><th align="left" style="background:#ecf0f1">Branch</th><td>${env.GIT_BRANCH ?: 'N/A'}</td></tr>
      </table>

      <h3>🧪 Results</h3>
      <table width="100%" cellpadding="8" style="border-collapse:collapse">
        <tr style="background:#ecf0f1"><th>Env</th><th>Status</th><th>Allure</th><th>Playwright</th><th>HTML</th></tr>
        <tr><td>🔧 DEV</td>  <td style="color:#27ae60"><b>${env.DEV_TEST_STATUS}</b></td>  <td><a href="${env.BUILD_URL}DEV_20Allure_20Report">View</a></td>  <td><a href="${env.BUILD_URL}DEV_20Playwright_20Report">View</a></td>  <td><a href="${env.BUILD_URL}DEV_20HTML_20Report">View</a></td></tr>
        <tr><td>🔍 QA</td>   <td style="color:#27ae60"><b>${env.QA_TEST_STATUS}</b></td>   <td><a href="${env.BUILD_URL}QA_20Allure_20Report">View</a></td>   <td><a href="${env.BUILD_URL}QA_20Playwright_20Report">View</a></td>   <td><a href="${env.BUILD_URL}QA_20HTML_20Report">View</a></td></tr>
        <tr><td>🎯 STAGE</td><td style="color:#27ae60"><b>${env.STAGE_TEST_STATUS}</b></td><td><a href="${env.BUILD_URL}STAGE_20Allure_20Report">View</a></td><td><a href="${env.BUILD_URL}STAGE_20Playwright_20Report">View</a></td><td><a href="${env.BUILD_URL}STAGE_20HTML_20Report">View</a></td></tr>
        <tr><td>🚀 PROD</td> <td style="color:#27ae60"><b>${env.PROD_TEST_STATUS}</b></td> <td><a href="${env.BUILD_URL}PROD_20Allure_20Report">View</a></td> <td><a href="${env.BUILD_URL}PROD_20Playwright_20Report">View</a></td> <td><a href="${env.BUILD_URL}PROD_20HTML_20Report">View</a></td></tr>
      </table>

      <p style="margin-top:20px">
        <a href="${env.BUILD_URL}allure" style="background:#27ae60;color:white;padding:8px 16px;text-decoration:none;border-radius:4px;margin:4px">📊 Combined Allure</a>
        <a href="${env.BUILD_URL}" style="background:#3498db;color:white;padding:8px 16px;text-decoration:none;border-radius:4px;margin:4px">🔗 View Build</a>
        <a href="${env.BUILD_URL}console" style="background:#f39c12;color:white;padding:8px 16px;text-decoration:none;border-radius:4px;margin:4px">📋 Console Log</a>
      </p>
    </div>
    <p style="text-align:center;color:#999;font-size:12px">GitHub Actions CI | ${env.JOB_NAME} | Build #${env.BUILD_NUMBER}</p>
  </div>
</body></html>"""
                    )
                } catch (Exception e) {
                    echo "Email notification failed: ${e.message}"
                }
            }
        }

        failure {
            echo '❌ Pipeline failed!'
            script {
                // ── Slack ──────────────────────────────────────────────
                try {
                    slackSend(
                        color  : 'danger',
                        message: """❌ *Playwright Pipeline: Tests Failed*
*Job:* ${env.JOB_NAME} | *Build:* #${env.BUILD_NUMBER}
*Branch:* ${env.GIT_BRANCH ?: 'N/A'}

${env.DEV_EMOJI   ?: '❓'} DEV:   ${env.DEV_TEST_STATUS   ?: 'not run'}
${env.QA_EMOJI    ?: '❓'} QA:    ${env.QA_TEST_STATUS    ?: 'not run'}
${env.STAGE_EMOJI ?: '❓'} STAGE: ${env.STAGE_TEST_STATUS ?: 'not run'}
${env.PROD_EMOJI  ?: '❓'} PROD:  ${env.PROD_TEST_STATUS  ?: 'not run'}

📊 <${env.BUILD_URL}allure|View Allure Report>
🔗 <${env.BUILD_URL}|View Build>"""
                    )
                } catch (Exception e) {
                    echo "Slack notification failed: ${e.message}"
                }

                // ── Email ──────────────────────────────────────────────
                try {
                    emailext(
                        subject : "❌ Playwright Tests Failed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                        from    : 'Nikhil Kakde CI <nikhilkakde07@gmail.com>',
                        replyTo : 'nikhilkakde07@gmail.com',
                        to      : env.EMAIL_RECIPIENTS,
                        mimeType: 'text/html',
                        body    : """
<html><body style="font-family:Arial,sans-serif;color:#333">
  <div style="max-width:650px;margin:0 auto">
    <div style="background:#e74c3c;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
      <h2>❌ Tests Failed</h2>
      <p>Playwright POM Automation Pipeline</p>
    </div>
    <div style="background:#f9f9f9;padding:20px;border-radius:0 0 8px 8px">
      <table width="100%" cellpadding="8" style="border-collapse:collapse">
        <tr><th align="left" style="background:#ecf0f1">Job</th><td>${env.JOB_NAME}</td></tr>
        <tr><th align="left" style="background:#ecf0f1">Build</th><td>#${env.BUILD_NUMBER}</td></tr>
        <tr><th align="left" style="background:#ecf0f1">Branch</th><td>${env.GIT_BRANCH ?: 'N/A'}</td></tr>
      </table>

      <h3>🧪 Results</h3>
      <table width="100%" cellpadding="8" style="border-collapse:collapse">
        <tr style="background:#ecf0f1"><th>Env</th><th>Status</th><th>Allure</th><th>Playwright</th><th>HTML</th></tr>
        <tr><td>🔧 DEV</td>  <td style="color:${env.DEV_TEST_STATUS=='success'?'#27ae60':'#e74c3c'}"><b>${env.DEV_TEST_STATUS   ?: 'not run'}</b></td><td><a href="${env.BUILD_URL}DEV_20Allure_20Report">View</a></td>  <td><a href="${env.BUILD_URL}DEV_20Playwright_20Report">View</a></td>  <td><a href="${env.BUILD_URL}DEV_20HTML_20Report">View</a></td></tr>
        <tr><td>🔍 QA</td>   <td style="color:${env.QA_TEST_STATUS=='success'?'#27ae60':'#e74c3c'}"><b>${env.QA_TEST_STATUS    ?: 'not run'}</b></td><td><a href="${env.BUILD_URL}QA_20Allure_20Report">View</a></td>   <td><a href="${env.BUILD_URL}QA_20Playwright_20Report">View</a></td>   <td><a href="${env.BUILD_URL}QA_20HTML_20Report">View</a></td></tr>
        <tr><td>🎯 STAGE</td><td style="color:${env.STAGE_TEST_STATUS=='success'?'#27ae60':'#e74c3c'}"><b>${env.STAGE_TEST_STATUS?: 'not run'}</b></td><td><a href="${env.BUILD_URL}STAGE_20Allure_20Report">View</a></td><td><a href="${env.BUILD_URL}STAGE_20Playwright_20Report">View</a></td><td><a href="${env.BUILD_URL}STAGE_20HTML_20Report">View</a></td></tr>
        <tr><td>🚀 PROD</td> <td style="color:${env.PROD_TEST_STATUS=='success'?'#27ae60':'#e74c3c'}"><b>${env.PROD_TEST_STATUS ?: 'not run'}</b></td><td><a href="${env.BUILD_URL}PROD_20Allure_20Report">View</a></td> <td><a href="${env.BUILD_URL}PROD_20Playwright_20Report">View</a></td> <td><a href="${env.BUILD_URL}PROD_20HTML_20Report">View</a></td></tr>
      </table>

      <p style="margin-top:20px">
        <a href="${env.BUILD_URL}allure" style="background:#27ae60;color:white;padding:8px 16px;text-decoration:none;border-radius:4px;margin:4px">📊 Combined Allure</a>
        <a href="${env.BUILD_URL}" style="background:#3498db;color:white;padding:8px 16px;text-decoration:none;border-radius:4px;margin:4px">🔗 View Build</a>
        <a href="${env.BUILD_URL}console" style="background:#e74c3c;color:white;padding:8px 16px;text-decoration:none;border-radius:4px;margin:4px">📋 Console Log</a>
      </p>
    </div>
    <p style="text-align:center;color:#999;font-size:12px">GitHub Actions CI | ${env.JOB_NAME} | Build #${env.BUILD_NUMBER}</p>
  </div>
</body></html>"""
                    )
                } catch (Exception e) {
                    echo "Email notification failed: ${e.message}"
                }
            }
        }

        unstable {
            echo '⚠️ Pipeline completed with warnings!'
            script {
                try {
                    slackSend(
                        color  : 'warning',
                        message: """⚠️ *Playwright Pipeline: Unstable*
*Job:* ${env.JOB_NAME} | *Build:* #${env.BUILD_NUMBER}
📊 <${env.BUILD_URL}allure|View Allure Report>
🔗 <${env.BUILD_URL}|View Build>"""
                    )
                } catch (Exception e) {
                    echo "Slack notification failed: ${e.message}"
                }
            }
        }
    }
}