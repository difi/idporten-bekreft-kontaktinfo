FROM eid-jenkins02.dmz.local:8081/codeceptjs:latest

RUN mkdir -p /tests
COPY /tests/ /tests

RUN runuser -l pptruser -c 'npm install --loglevel=warn --prefix /codecept mysql uuidv4'
