#service.pp
class idporten_bekreft_kontaktinfo::service inherits idporten_bekreft_kontaktinfo {

  include platform

  if ($platform::deploy_spring_boot) {
    service { $idporten_bekreft_kontaktinfo::service_name:
      ensure => running,
      enable => true,
    }
  }
}
