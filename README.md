# HetznerDNS
HetznerDNS api NodeJS CLI grab information quickly and easily

Usage:

<code>wget -qO-  https://raw.githubusercontent.com/rowangg/HetznerDNS/master/hdns.js | node - API_KEY {vairble}</code>

Varibles:

all = Gives all information about all sites
name = Give the domain names of all zones
id = Gives the Zone ID for all sites
ttl = Gives the default TTL for all zones
created = Gives the date all zones where created on hetzner DNS
modified = Gives the date all zopnes where last edited
ns = Gives the name servers each domain should be pointing to
