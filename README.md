# idporten-bekreft-kontaktinfo
Bekreft dine kontaktopplysninger/reservasjon i ID-porten.

Lokalt kjøring mot atest (ondemand)

 ./docker/run-local
 
 //deploy codeceptjs stack til idporten_bekreft
VERSION=DEV-SNAPSHOT REGISTRY=local docker stack deploy -c docker/stack-codecept-tests.yml bekreft-kontaktinfo


 //loggen kan sjekke med kommondo
 
docker service logs  bekreft-kontaktinfo_codeceptjs -f -t


