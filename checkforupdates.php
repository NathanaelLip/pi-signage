<?php
if (file_exists('update.false')) { 
    echo 'false';
    }
if (file_exists('update.true')) {
    echo 'true';
    rename('update.true', 'update.false');
    }
?>