/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },
    onPause: function() {
        console.log('onPause()');
    },
    onResume: function() {
        console.log('onResume()');
    },
    onDeviceReady: function() {
        var uuid = 'DA5336AE-2042-453A-A57F-F80DD34DFCD9'; // mandatory
        var identifier = 'mobile'; // mandatory
        var minor = 1000; // optional, defaults to wildcard if left empty
        var major = 5; // optional, defaults to wildcard if left empty

        // throws an error if the parameters are not valid
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

        var delegate = new cordova.plugins.locationManager.Delegate().implement({

            didDetermineStateForRegion: function (pluginResult) {
                console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
            },

            didStartMonitoringForRegion: function (pluginResult) {
               console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
            },

            didRangeBeaconsInRegion: function (pluginResult) {
                console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
                var beacons = pluginResult.beacons;
                var found = false;
                beacons.forEach(function(beacon) {
                    if(beacon.major === major) {
                        console.log('Beacon in range');
                        setLog('Beacon is in range! (' + beacon.proximity + ')');

                        if(beacon.proximity === "ProximityNear") {
                            console.log('Proximity Near');
                        } else if(beacon.proximity === "ProximityFar"){
                            console.log('Proximity far');
                        }

                        found = true;
                    }
                }); 

                if(found) {
                    $("#status").attr("src","img/connected.png");
                } else {
                    console.log('Beacon not in range');
                    setLog('Beacon not in range...');
                    $("#status").attr("src","img/not-connected.png");
                }
            }
        });

        cordova.plugins.locationManager.setDelegate(delegate);

        // required in iOS 8+
        cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        // or cordova.plugins.locationManager.requestAlwaysAuthorization()

        // startMonitoringForRegion -- startRangingBeaconsInRegion
        cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
            .fail('ERROR' + console.error)
            .done();
    }
};

app.initialize();

var setLog = function(message) {
    $('#log').html(message);
};        