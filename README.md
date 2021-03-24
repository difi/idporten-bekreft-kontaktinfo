# idporten-bekreft-kontaktinfo
Bekreft dine kontaktopplysninger/reservasjon i ID-porten.

## atest (ondemand)
For å teste IBK kreves det at idporten prosjektet kjører.


### idporten prosjektet
Konfigurer idporten til å gå mot IBK lokalt.

Endre `docker/stack.yml`
```
   idporten-bekreft-kontaktinfo:
-    image: eid-jenkins02.dmz.local:8082/idporten-bekreft-kontaktinfo:latest
+    image: ${REGISTRY}/idporten-bekreft-kontaktinfo:${VERSION}
```

Endre `puppet_modules/idporten_opensso/manifests/params.pp`
```
-  $digitalcontactinfo_enabled                    = true
+  $digitalcontactinfo_enabled                    = false
...
-  $kontaktinfo_enabled                           = false
+  $kontaktinfo_enabled                           = true
```

Idporten prosjektet må bygges på nytt og stack kjøres opp i docker.


### IBK
Etter at du har gjort endringer i IBK kan du kjøre
`sh ./dev build` som vil bygge IBK på nytt og restarte IBK docker service (idporten stack) slik at endringene er tilgjengelig i atest

For å teste IBK kan du f.eks gå til `https://eid-atest-web01.dmz.local/minprofil`

NB! for at bruker skal få opp IBK applikasjonen krever det at bruker 1. ikke har oppdatert kontaktinfo på 90 dager. 2. Mangler e-post og eller mobil

## Development

IBK består av Spring boot (backend) og en React applikasjon.

For å kjøre React applikasjon
`cd idporten-bekreft-kontaktinfo-web/src/main/react` og kjør applikasjon med `yarn start`. Applikasjon er tilgjengelig på `localhost:3000`
