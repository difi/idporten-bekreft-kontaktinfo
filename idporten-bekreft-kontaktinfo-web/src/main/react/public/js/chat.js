$(document).ready(function() {

    let searchParams = new URLSearchParams(window.location.search)
    let lngParam = searchParams.get('lng')

    lang_code = 'NO'
    msgWelcom_custom = 'Velkommen til brukerstøtte for ID-porten og Digitaliseringsdirektoratets øvrige fellesløsninger. Dialogen med brukerstøtte går i sikker kanal over internett. Dialoger tas vare på i 2 dager før de slettes. Ønsker du kopi av dialogen på e-post, skriv inn e-postadressen etter at dialogen er avsluttet.';
    msgTimeClosed_custom = 'Åpningstider Mandag - Fredag 08:00 - 15:30';
    msgGoodbye_custom = 'Vi gjør deg oppmerksom på at ikke alle leverandører av e-posttjenester tilbyr transport av e-post over sikker kanal. Dette ligger utenfor Digitaliseringsdirektoratets ansvar.';
  
    if(lngParam != null){
      if(lngParam == 'en'){
        lang_code = 'EN';
        msgWelcom_custom = 'Welcome to user support for ID-porten and Digitaliseringsdirektoratet\'s other common solutions. The dialogue with user support goes in a secure channel over the internet. Dialogues are kept for 2 days before they are deleted. If you want a copy of the dialogue by e-mail, enter the e-mail address after the dialogue has ended.';
        msgGoodbye_custom = 'We remind you that not all email service providers provide secure channel email transportation. This is beyond Digitaliseringsdirektoratet\'s responsibility.\n';
        msgTimeClosed_custom = 'Opening hours Monday - Friday 08:00 - 15:30';
      }
  
      if(lngParam == 'nn'){
        msgWelcom_custom = 'Velkomen til brukarstøtte for ID-porten og Digitaliseringsdirektoratets øvre fellesløysingar. Dialogen med brukarstøtte går i sikker kanal over internett. Dialogar vert tekne vare på i 2 dager før dei vert sletta.  Ynskjer du kopi av dialogen på e-post, skriv inn e-postadressa etter at dialogen er avslutta.';
        msgTimeClosed_custom = 'Åpningstider Mandag - Fredag 08:00 - 15:30';
        msgGoodbye_custom = 'Me gjer deg merksam på at ikkje alle leverandørar av e-posttenestar tilbyr sending av e-post over sikker kanal. Dette ligg utanfor Digitaliseringsdirektoratet sitt ansvar.';
      }
    }
  
    $('#idporten-chat').intelecomChat({
      customerKey: 40799,
      queueKey: 'chat_id_porten2',
      timeId: '14057_time3', //check opening hours
      timeOpenExits: ['Åpent'], //possible to set other exit names
      msgTimeClosed: msgTimeClosed_custom, // text message
      visualQueueId: 27504, //checks queue,closes if no agents are logged on
      languageCode: lang_code, //language settings (EN, NO, SE, DK, FI, HU, BG)
      showIntro: true, //to show intro text field at initiation
      msgWelcome: msgWelcom_custom,
      msgGoodbye: msgGoodbye_custom, // text message
    });
  });