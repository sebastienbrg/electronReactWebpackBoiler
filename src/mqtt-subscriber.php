<?php

require __DIR__ . '/../vendor/autoload.php';

require_once("definitions.php");
require_once("helpers.php");

use Bluerhinos\phpMQTT;

///////////////////////////////////////////////////////

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$logger = new Logger(MQTT_CLIENT_ID);
$logger->pushHandler(new StreamHandler(MQTT_SUBSCRIBER_LOG, MQTT_SUBSCRIBER_LOG_LEVEL));

$logger->info("Just started!");

///////////////////////////////////////////////////////

$cards = file(PROC_I2C0);
if (!$cards) {
    $cards = [];
}

$global_st3_settings = [];
$global_st4_settings = [];
$global_info_status = [];
$global_system_status = [];
$global_events = [];

$registered = [];

$loop = React\EventLoop\Factory::create();


function register_timer($type, $cb = null, $interval = 1.0)
{
    global $loop, $registered;

    $timer = &$registered[$type];

    if (isset($timer)) {
        $loop->cancelTimer($timer);
    }

    $timer = $loop->addTimer($interval, function () use ($type, $cb) {
        if (is_callable($cb)) {
            $cb();
        }
    });
}


require_once("mqtt-subscriber/callbacks.php");

require_once("mqtt-subscriber/message_handlers/TRT/INFO.php");
require_once("mqtt-subscriber/message_handlers/ACQ/INFO.php");
require_once("mqtt-subscriber/message_handlers/TRT/RENUM.php");
require_once("mqtt-subscriber/message_handlers/TRT/PMI.php");
require_once("mqtt-subscriber/message_handlers/ACQ/PMI.php");
require_once("mqtt-subscriber/message_handlers/NEW_CFG/ST3.php");
require_once("mqtt-subscriber/message_handlers/NEW_CFG/ST4.php");
require_once("mqtt-subscriber/message_handlers/EVT.php");
require_once("mqtt-subscriber/message_handlers/CMD.php");
require_once("mqtt-subscriber/message_handlers/SYS.php");
require_once("mqtt-subscriber/message_handlers/LS_STATUS.php");

require_once("mqtt-subscriber/message_handlers/debug.php");

init_events();


$topics = [
    "TRT/+/+" => ["qos" => 0, "function" => $handle_INFO_TRT_message],
    "ACQ/+/+" => ["qos" => 0, "function" => $handle_INFO_ACQ_message],
    "TRT/RENUM/+/+" => ["qos" => 0, "function" => $handle_RENUM_TRT_message],
    "ACQ/RENUM/+/+" => ["qos" => 0, "function" => $handle_RENUM_TRT_message], // TODO ???
    "TRT/PMI/+/+" => ["qos" => 0, "function" => $handle_PMI_TRT_message],
    "ACQ/PMI/+/+" => ["qos" => 0, "function" => $handle_PMI_ACQ_message],
    "ST3/NEW_CFG" => ["qos" => 0, "function" => $handle_NEW_CFG_ST3_message],
    "ST4/NEW_CFG" => ["qos" => 0, "function" => $handle_NEW_CFG_ST4_message],
    "WEB/NEW_CFG" => ["qos" => 0, "function" => $handle_NEW_CFG_ST4_message], // ?????
    "EVT" => ["qos" => 0, "function" => $handle_EVT_message],
    "CMD/EMPTY_EVENT_LIST" => ["qos" => 0, "function" => $handle_EVT_empty_list],
    "SYS/+" => ["qos" => 0, "function" => $handle_SYS_message],
    "LS/STATUS/+" => ["qos" => 0, "function" => $handle_LS_STATUS_message],
    // "#" => ["qos" => 0, "function" => $handle_any_message], // debug

];


$mqtt = new phpMQTT(MQTT_SERVER, MQTT_PORT, MQTT_CLIENT_ID);
$mqtt->keepalive = 60;
//$mqtt->debug = true;

if (!$mqtt->connect(true, NULL, MQTT_USERNAME, MQTT_PASSWORD)) {
    $logger->critical("Could not connect to Mosquitto. Quitting.");
    // TODO should try again then!
    exit(1);
}
echo "Subscribing\n";
foreach ($topics as $k => $v) {
    $mqtt->subscribe([$k => $v], 0);
}
echo "Done subscribing\n";

//$mqtt->subscribe($topics, 0);


///////////////////////////////////


$loop->addPeriodicTimer(0.05, function () use ($mqtt) {
    $mqtt->proc(false);
});

// this is ugly, but client will timeout and reconnect
// if server is not explicitly pinged from time to time
$loop->addPeriodicTimer(20, function () use ($mqtt) {
    $mqtt->ping();
});


$loop->run();


// TODO this point can never be reached
$logger->info("Shutting Down.");
$mqtt->close();


?>
