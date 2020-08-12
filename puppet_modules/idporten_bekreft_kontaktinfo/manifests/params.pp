#params.pp
class idporten_bekreft_kontaktinfo::params {
  # Note - need to update package.json & rebuild if context path is changed
  $app_context_path                            = '/'
  $install_dir                                     = '/opt/'
  $config_dir                                     = '/etc/opt/'
  $config_root                                     = '/etc/opt/'
  $log_root                                        = '/var/log/'
  $log_level                                       = 'WARN'
  $application                                 = 'idporten-bekreft-kontaktinfo'
  $app_root                                    = "${install_dir}/${application}"
  $service_name                                = "${application}"

  $group_id                                    = 'no.digdir'
  $artifact_id                                 = 'idporten-bekreft-kontaktinfo'
  $oidc_provider_url            = hiera('idporten_bekreft_kontaktinfo::idporten_oidc_provider_url')

  $server_port                                 = 8080
}
