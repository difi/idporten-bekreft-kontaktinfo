#config.pp
class idporten_bekreft_kontaktinfo::config inherits idporten_bekreft_kontaktinfo {

  file { "${idporten_bekreft_kontaktinfo::install_dir}${idporten_bekreft_kontaktinfo::application}/${idporten_bekreft_kontaktinfo::artifact_id}.conf":
    ensure  => 'file',
    content => template("${module_name}/${idporten_bekreft_kontaktinfo::artifact_id}.conf.erb"),
    owner   => $idporten_bekreft_kontaktinfo::service_name,
    group   => $idporten_bekreft_kontaktinfo::service_name,
    mode    => '0400',
  } ->
  file { "${idporten_bekreft_kontaktinfo::config_dir}${idporten_bekreft_kontaktinfo::application}/application.yaml":
    ensure  => 'file',
    content => template("${module_name}/application.yaml.erb"),
    owner   => $idporten_bekreft_kontaktinfo::service_name,
    group   => $idporten_bekreft_kontaktinfo::service_name,
    mode    => '0400',
  } ->
  file { "${idporten_bekreft_kontaktinfo::config_root}${idporten_bekreft_kontaktinfo::application}/cache-transport.xml":
        ensure  => 'file',
        content => template("${module_name}/cache-transport.xml.erb"),
        owner   => $idporten_bekreft_kontaktinfo::service_name,
        group   => $idporten_bekreft_kontaktinfo::service_name,
        mode    => '0644',
  } ->
  file { "/etc/rc.d/init.d/${idporten_bekreft_kontaktinfo::service_name}":
    ensure => 'link',
    target => "${idporten_bekreft_kontaktinfo::install_dir}${idporten_bekreft_kontaktinfo::application}/${idporten_bekreft_kontaktinfo::artifact_id}.jar",
  }

  difilib::logback_config { $idporten_bekreft_kontaktinfo::application:
    application       => $idporten_bekreft_kontaktinfo::application,
    owner             => $idporten_bekreft_kontaktinfo::service_name,
    group             => $idporten_bekreft_kontaktinfo::service_name,
    performance_class => 'no.difi.bekreftkontaktinfo.backend.logging.performance',
    loglevel_no       => $idporten_bekreft_kontaktinfo::log_level,
    loglevel_nondifi  => $idporten_bekreft_kontaktinfo::log_level,
  }


}
