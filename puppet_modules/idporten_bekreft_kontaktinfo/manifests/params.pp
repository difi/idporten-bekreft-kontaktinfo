#params.pp
class idporten_bekreft_kontaktinfo::params {
  # Note - need to update package.json & rebuild if context path is changed
  $app_context_path                           = '/'
  $install_dir                                = '/opt/'
  $config_dir                                 = '/etc/opt/'
  $config_root                                = '/etc/opt/'
  $log_root                                   = '/var/log/'
  $log_level                                  = 'WARN'
  $application                                = 'idporten-bekreft-kontaktinfo'
  $service_name                               = 'idporten-bekreft-kontaktinfo'
  $artifact_id                                = 'idporten-bekreft-kontaktinfo-web'
  $group_id                                   = 'no.digdir'
  $krr_backend_url                            = hiera('kontaktinfo_backend::url')
  $krr_backend_read_timeout                   = 10000
  $krr_backend_connect_timeout                = 10000
  $krr_tip_days_user                          = 90
  $cache_local_ttl_in_s                       = 5
  $cache_cluster_ttl_in_s                     = 300
  $par_cache_ttl_in_s                         = 120
  $cache_transport_file_location              = '/etc/opt/idporten-bekreft-kontaktinfo/'
  $cache_groups_udp_mcast_port                = 45588
  $cache_groups_udp_bind_addr                 = 'match-interface:eth0' # only works if all nodes on same machine. See http://www.jgroups.org/manual/index.html#Transport.
  $tomcat_tmp_dir                             = '/opt/idporten-bekreft-kontaktinfo/tmp'
  $health_show_details                        = 'always'
  $server_port                                = 8080
  $java_home                                  = hiera('platform::java_home')
}
