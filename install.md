# Nginx
```
sudo apt update && sudo apt upgrade
```

```
sudo apt remove apache2
```

```
sudo apt install nginx && sudo systemctl start nginx
```

# PHP
#### For Raspbian
```
sudo apt install lsb-release
```

```
curl https://packages.sury.org/php/apt.gpg | sudo tee /usr/share/keyrings/suryphp-archive-keyring.gpg >/dev/null
```


```
echo "deb [signed-by=/usr/share/keyrings/suryphp-archive-keyring.gpg] https://packages.sury.org/php/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/sury-php.list
```

```
sudo apt update
```

```
sudo apt install php8.1-fpm php8.1-mbstring php8.1-mysql php8.1-curl php8.1-gd php8.1-curl php8.1-zip php8.1-xml -y
```

#### For Ubuntu
```
sudo apt install php
```

```
sudo nano /etc/nginx/sites-enabled/default
```

**Find**
```location / {```

**Add**
```
if ($request_uri ~ ^/(.*)\.html(\?|$)) {
	return 302 /$1;
}
try_files $uri $uri.html $uri/ =404;
```
*Removes .html from the end of your URLS*

Find *"Add index.php to the list if you are using PHP"* and do what it says

**Find**
```
location ~ \.php$ {
       include snippets/fastcgi-php.conf;
       # With php5-cgi alone:
       fastcgi_pass 127.0.0.1:9000;
       # With php5-fpm:
       fastcgi_pass unix:/var/run/php5-fpm.sock;
}
```

**Replace with**
```
location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
}
```
```
sudo systemctl reload nginx
```

# Download the webpage
```
sudo apt install git
```
```
cd /var/www/html/
```
```
sudo git clone https://github.com/NathanaelLip/pi-signage.git
```
```
cd pi-signage
```
```
sudo mv * ../
```

# Setup chrome
```
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox
```
```
sudo apt-get install --no-install-recommends chromium-browser
```

#### Set Chromium settings
```
sudo nano /etc/xdg/openbox/autostart
```
Add to file
```
# Disable any form of screen saver / screen blanking / power management
xset s off
xset s noblank
xset -dpms

# Allow quitting the X server with CTRL-ATL-Backspace
setxkbmap -option terminate:ctrl_alt_bksp

# Start Chromium in kiosk mode
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State'
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences
chromium-browser --disable-infobars --kiosk 'http://127.0.0.1'"
```

# Start chromium page
```
startx -- -nocursor
```

Now go to either the `device.local/slides.html` address or the `ip of device on network eg. 192.168.0.1/slides.html` to edit the slides it uses.

<sub>Install instructions based on these guides by: [die-antwork](https://die-antwort.eu/techblog/2017-12-setup-raspberry-pi-for-kiosk-mode/) and [pimylifeup](https://pimylifeup.com/raspberry-pi-nginx/)</sub>