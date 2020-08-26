# HetznerDNS
HetznerDNS api CLI tool written in node.js to quickly manage the HetznerDNS API.

This API will allow you to very quickly and easily GET and POST to the Hetzner DNS API.

# Usage

This API utilizes a terminal command to allow for quick and easy use of the HetznerDNS api.  The following command can be used to use this API. 

<code>wget -qO-  https://git.io/JUTeO | node - --key (API Key or Key File) ([Option 1, Option 2, Option 3, Option 4, etc...])</code>

# Options

### <code>-k</code> or <code>--key</code>

 This option is to allow you to enter your API Key into the application.  It can be formatted as a string or it can be formatted as a key file. An API Key file is a file containing your API key, this will allow for quick use of the HetznerDNS API.  The API key file **MUST** be named <code>api.key</code>.
 
 Usage (With API Key): <code>wget -qO-  https://git.io/JUTeO | node - -k 84BFPidGvvNgeX9kdbs4ErmyMp05BI9p</code>
 
 Usage (With API Key File): <code>wget -qO-  https://git.io/JUTeO | node - -k api.key</code>

Varibles:

all = Gives all information about all sites
name = Give the domain names of all zones
id = Gives the Zone ID for all sites
ttl = Gives the default TTL for all zones
created = Gives the date all zones where created on hetzner DNS
modified = Gives the date all zopnes where last edited
ns = Gives the name servers each domain should be pointing to
