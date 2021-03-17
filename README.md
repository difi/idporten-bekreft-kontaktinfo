# idporten-bekreft-kontaktinfo
Bekreft dine kontaktopplysninger/reservasjon i ID-porten.

Lokalt kjøring mot atest (ondemand)


### Fjerne gammel deploy:
`docker service rm bekreft-kontaktinfo_codeceptjs`

### Bygge ny codecept og deploy stack:
`./docker/run-local`

### Deploy ny codecept til stack:
`VERSION=DEV-SNAPSHOT REGISTRY=local docker stack deploy -c docker/stack-codecept-tests.yml bekreft-kontaktinfo`

### Loggen kan sjekkes med kommando
`docker service logs  bekreft-kontaktinfo_codeceptjs -f -t`