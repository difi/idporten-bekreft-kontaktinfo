# deploy
class idporten_bekreft_kontaktinfo::deploy inherits idporten_bekreft_kontaktinfo {

  difilib::spring_boot_deploy { $idporten_bekreft_kontaktinfo::application:
    package      => $idporten_bekreft_kontaktinfo::group_id,
    artifact     => $idporten_bekreft_kontaktinfo::artifact_id,
    service_name => $idporten_bekreft_kontaktinfo::service_name,
    install_dir  => "${idporten_bekreft_kontaktinfo::install_dir}${idporten_bekreft_kontaktinfo::application}",
  }
}
