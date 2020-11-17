class idporten_bekreft_kontaktinfo::test_setup inherits idporten_bekreft_kontaktinfo{

  if ($platform::test_setup) {

    file { "${idporten_bekreft_kontaktinfo::config_root}${idporten_bekreft_kontaktinfo::application}/keystore.jks":
      ensure => 'file',
      source => "puppet:///modules/${caller_module_name}/keystore.jks",
      group  => $idporten_bekreft_kontaktinfo::service_name,
      owner  => $idporten_bekreft_kontaktinfo::service_name,
      mode   => '0644',
      notify => Class['idporten_bekreft_kontaktinfo::Service'],
    }
  }

}
