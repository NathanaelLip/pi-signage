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

sudo apt-get update
sudo apt-get upgrade

sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox

sudo apt-get install --no-install-recommends chromium-browser