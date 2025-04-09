# sudo apt-get update -qq

# sudo apt-get install --no-install-recommends xserver-xorg-video-all \
#   xserver-xorg-input-all xserver-xorg-core xinit x11-xserver-utils \
#   chromium-browser unclutter

# echo "System Options > Boot / Auto Login > Console Autologin | Press Enter | Right arrow key twice > Finish
# sudo raspi-config

# sudo nano /home/pi/.bash_profile

# if [ -z $DISPLAY ] && [ $(tty) = /dev/tty1 ]
# then
#   startx
# fi

# sudo nano /home/pi/.xinitrc

# #!/usr/bin/env sh
# xset -dpms
# xset s off
# xset s noblank

# unclutter &
# chromium-browser https://yourfancywebsite.com \
#   --window-size=1920,1080 \
#   --window-position=0,0 \
#   --start-fullscreen \
#   --kiosk \
#   --incognito \
#   --noerrdialogs \
#   --disable-translate \
#   --no-first-run \
#   --fast \
#   --fast-start \
#   --disable-infobars \
#   --disable-features=TranslateUI \
#   --disk-cache-dir=/dev/null \
#   --overscroll-history-navigation=0 \
#   --disable-pinch

# Nginx
sudo apt update
sudo apt upgrade

sudo apt remove apache2

sudo apt install nginx

sudo systemctl start nginx

# PHP
sudo apt install php7.4-fpm php7.4-mbstring php7.4-mysql php7.4-curl php7.4-gd php7.4-curl php7.4-zip php7.4-xml -y

sudo nano /etc/nginx/sites-enabled/default
# add index.php to line where it says "Add index.php to the list if you are using PHP"

# Find
#location ~ \.php$ {
        #       include snippets/fastcgi-php.conf;
        #
        #       # With php5-cgi alone:
        #       fastcgi_pass 127.0.0.1:9000;
        #       # With php5-fpm:
        #       fastcgi_pass unix:/var/run/php5-fpm.sock;
        #}

# Replace with
# location ~ \.php$ {
#                include snippets/fastcgi-php.conf;
#                fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
#         }

sudo systemctl reload nginx


# Setup chrome
sudo apt-get update
sudo apt-get upgrade

sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox

sudo apt-get install --no-install-recommends chromium-browser