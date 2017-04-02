/**
 * Created by jamesbray on 10/13/16.
 */

var app = angular.module('strawberry23', []);

app.directive('file', function() {
    return {
        restrict: 'AE',
        scope: {
            file: '@'
        },
        link: function(scope, el, attrs){
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];
                scope.file = file;
                scope.$parent.file = file;
                scope.$apply();
            });
        }
    };
}).service('uploadService', function($log, $http, $q) {

    this.uploadFile = function(file) {
        console.debug("::ENTER:: uploadService.uploadFile(file)...");
        // Get The PreSigned URL
        $http.post('/presigned',{ filename: file.name, type: file.type }).
        success(function(resp) {
            // Perform The Push To S3
            $http.put(resp.url, file, {headers: {'Content-Type': file.type}})
                .success(function(resp) {
                    //Finally, We're done
                    alert('Upload Done!')
                })
                .error(function(resp) {
                    alert("An Error Occurred Attaching Your File");
            });
        })
        .error(function(resp, e) {
            console.error(e.message);
            alert("An Error Occurred Attaching Your File");
        });
    };
}).
controller('uploadController', function($log, $scope, uploadService) {
    console.debug("Entering uploadController...");

    $scope.object = {};

    $scope.showFileAttributes = function(obj) {
        console.debug("::ENTER:: uploadController.showFileAttributes()...");
        console.debug($scope.file);
        if($scope.file.size > 10585760) {
            console.warn("File " + $scope.file.name + " is too large!");
            alert("File " + $scope.file.name + " is too large!  File must be under 10MB.");
            return;
        }
        console.debug($scope.file.type);
        if(($scope.file.type != "image/jpeg") && ($scope.file.type != "image/png")) {
            console.warn("File " + $scope.file.name + " is a supported image type!");
            alert("File " + $scope.file.name + " is not an image!  The file must be a PNG or JPEG file.");
            return;
        }
        //alert("The file name is: " + $scope.file.name);
        uploadService.uploadFile(obj);
        console.debug("::EXIT:: uploadController.showFileAttributes()...");
    };

});
