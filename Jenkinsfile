pipelineWithMavenAndDocker {
    verificationEnvironment = 'eid-verification2'
    stagingEnvironment = 'eid-staging'
    stagingEnvironmentType = 'puppet2'
    puppetModules = 'idporten_bekreft_kontaktinfo'
    librarianModules = 'DIFI-idporten_bekreft_kontaktinfo'
    puppetApplyList = [
            'eid-systest-app01.dmz.local baseconfig,idporten_bekreft_kontaktinfo'
    ]
}
