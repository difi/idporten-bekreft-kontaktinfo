# idporten-bekreft-kontaktinfo
Bekreft dine kontaktopplysninger/reservasjon i ID-porten.

Lokalt kjøring mot atest (ondemand)


fjerne gammel deploy:
 docker service rm bekreft-kontaktinfo_codeceptjs
bygge ny codecept og deploy stack:
 ./docker/run-local
deploy ny codecept til stack:
 VERSION=DEV-SNAPSHOT REGISTRY=local docker stack deploy -c docker/stack-codecept-tests.yml bekreft-kontaktinfo
 
  //loggen kan sjekke med kommondo
  
 docker service logs  bekreft-kontaktinfo_codeceptjs -f -t