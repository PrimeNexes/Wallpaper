//Main
//On Profile Click for Main wall and Upload Wall
var onClickDataVar;
var onClickData = function (data) {
    onClickDataVar = data;
};
//On DP URL for Main wall and Upload Wall
var url_DP;
var url_DPVar = function (data) {
    url_DP = data;
};;
//On Category Click for Caregories
var onCatClickVar;
var onCatClick = function (data) {
    onCatClickVar = data;
};

function profileEngine() {
    var userId = firebase.auth().currentUser;
    document.getElementById('profileUsername').innerHTML = '@' + onClickDataVar.val().uname;
    firebase.database().ref('/userDB/' + onClickDataVar.val().uid + '/fullname').once('value').then(function (profileData) {
        document.getElementById('profileFullname').innerHTML = profileData.val();
    });
    firebase.database().ref('/userDB/' + onClickDataVar.val().uid + '/followedBy/followedByInt').once('value').then(function (profileData) {
        document.getElementById('profileFollowers').innerHTML = profileData.val();
    });
    firebase.database().ref('/userDB/' + onClickDataVar.val().uid + '/following/followingInt').once('value').then(function (profileData) {
        document.getElementById('profileFollowing').innerHTML = profileData.val();
    });
    firebase.storage().ref('profilePicture/' + onClickDataVar.val().uid + '/dp.jpeg').getDownloadURL().then(function (urlDP) {
        document.getElementById('profileDPView').setAttribute('src', urlDP);
    }).catch(function (error) { });


    if (userId.emailVerified) { }
    else { document.getElementById('followBtn').setAttribute("disabled", "true"); console.log('Email is not verified at Profile'); }
    firebase.database().ref('/userDB/' + userId.uid + '/following/' + onClickDataVar.val().uid).once('value').then(function (checkiffolwing) {
        if (checkiffolwing.val() === null) {
            document.getElementById('followBtn').onclick = function () {

                firebase.database().ref('/userDB/' + userId.uid + '/following/' + onClickDataVar.val().uid).set(true);
                console.log("setting follwing in current user");
                firebase.database().ref('/userDB/' + userId.uid + '/following/followingInt').once('value').then(function (followingpp) {
                    firebase.database().ref('/userDB/' + userId.uid + '/following/followingInt').set(followingpp.val() + 1);
                    console.log("setting follwingInt in current user");
                });
                firebase.database().ref('/userDB/' + onClickDataVar.val().uid + '/followedBy/' + userId.uid).set(true);
                console.log("setting follwed by in profile user");
                firebase.database().ref('/userDB/' + onClickDataVar.val().uid + '/followedBy/followedByInt').set(profileData.val() + 1);
                console.log("setting follwedbyInt in profile user");
                this.setAttribute("disabled", "true");
            }

        }
        else if (checkiffolwing.val() === true) {
            console.log("disabling");
            document.getElementById('followBtn').setAttribute("disabled", "true");
        }
    });

};

var myNavigator = document.getElementById('mainNavigator');
    document.addEventListener('init', function (event)
    {
        firebase.database().goOnline();
        var page = event.target;
        var nav = function () {

            page.querySelector('#myLikesBtn').onclick = function () {
                document.querySelector('#mainNavigator').pushPage('myUpd.html');
            };
            page.querySelector('#homeBtn').onclick = function () {
                document.querySelector('#mainNavigator').pushPage('home.html');
            };
            page.querySelector('#catBtn').onclick = function () {
                document.querySelector('#mainNavigator').pushPage('cat.html');
            };
            page.querySelector('#myAccBtn').onclick = function () {

                document.querySelector('#mainNavigator').pushPage('myAcc.html');
            };
            page.querySelector('#tuploadBtn').onclick = function () {

                document.querySelector('#mainNavigator').pushPage('uploading.html');
            };


        };
 
        if (page.id === 'sp')
        {
            const promise = firebase.auth().onAuthStateChanged(function (user)
            {
                if (user)
                {
                    if (user.emailVerified)
                    {
                        //DO NOTHING 
                    }
                    else
                    { ons.notification.alert('Verify your Account to get full access.The verification email is sent to your email address'); }

                    document.querySelector('#mainNavigator').pushPage('home.html');             
                }
                else
                {
                    document.querySelector('#mainNavigator').pushPage('login.html');
                }

            });
        }

        if (page.id === 'login')
        {
            //=Nav

            myNavigator.onDeviceBackButton = (function (event) {
                ons.notification.confirm('Do you want to close the app?') // Ask for confirmation
                  .then(function (index) {
                      if (index === 1) { // OK button
                          navigator.app.exitApp(); // Close the app
                      }
                  });
            });
            //If Already Logged in End
            page.querySelector('#loginBtn').onclick = function ()
            {
                //Login Auth
                var loginUser = page.querySelector("#loginUser").value;
                var loginPass = page.querySelector("#loginPass").value;
                const lauth = firebase.auth();
                const promise = lauth.signInWithEmailAndPassword(loginUser, loginPass)
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode === 'auth/wrong-password') {
                        ons.notification.alert('Wrong password.');
                    }
                    else if (errorCode === 'auth/email-already-in-use') {
                        ons.notification.alert('User is already Loged in');
                    }
                    else {
                        ons.notification.alert(error);
                    }
                    console.log(error);

                });
                //Login Auth End
            };
            page.querySelector('#signupBtn').onclick = function ()
            {
                document.querySelector('#mainNavigator').pushPage('signup.html');
            };
            page.querySelector('#fpassBtn').onclick = function ()
            {
                document.querySelector('#mainNavigator').pushPage('fpass.html');
            };

        }
        else if (page.id === 'signup')
        {
            myNavigator.onDeviceBackButton.enable();

            page.querySelector('#makeaccBtn').onclick = function ()
            {
                //Signup Auth
                var signinUser = page.querySelector('#signinUser').value;
                var signinPass = page.querySelector('#signinPass').value;
                var fullname = page.querySelector('#fullname').value;
                console.log(signinPass + signinUser);
                if (fullname) {
                    firebase.auth().createUserWithEmailAndPassword(signinUser, signinPass)
                        .then(function () {
                            //Set Display name of user                   
                            var user = firebase.auth().currentUser;
                            var str = user.email;
                            var i = str.indexOf("@");
                            var n = str.substr(0, i);
                            user.updateProfile({ displayName: n });
                            console.log("User Created with displayName " + n);
                            //Set Display name of user End
                            user.sendEmailVerification().then(function () {
                                //create userDB 
                                var userId = firebase.auth().currentUser;
                                firebase.database().ref('userDB/' + userId.uid).set({ fullname: fullname, followedBy: { followedByInt: 0 }, following: { followingInt: 0 }, uploads: 0, wallpaperLiked: 0 });
                                ons.notification.alert('Account created !');
                            }, function (error) {
                                ons.notification.alert("Can't send Email for verification ! Re-try sending the mail underprofile page");
                            });
                        })
                        .catch(function (error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            if (errorCode == 'auth/weak-password') {
                                ons.notification.alert('The password is too weak.');
                            }
                            else {
                                ons.notification.alert(error);
                            }
                            console.log(errorMessage);
                        });
                }
                else {
                    ons.notification.alert('Please enter your name');
                }
                //Signup Auth End         
            };
        }
        else if (page.id === 'fpass')
        {
            myNavigator.onDeviceBackButton.enable();

            page.querySelector('#sendfpassBtn').onclick = function ()
            {
                var fpassEmail = page.querySelector('#fpassEmail').value;
                var auth = firebase.auth();
                auth.sendPasswordResetEmail(fpassEmail).then(function ()
                {
                    ons.notification.confirm("Email sent.Reset your password via the link provided");
                },
                function (error)
                {
                    ons.notification.confirm("No such email found.");
                });
            }

        }


    });

    document.addEventListener('show', function (event)
    {
        var page = event.target;
        var nav = function () {

            page.querySelector('#myLikesBtn').onclick = function () {
                document.querySelector('#mainNavigator').pushPage('myUpd.html');
            };
            page.querySelector('#homeBtn').onclick = function () {
                document.querySelector('#mainNavigator').pushPage('home.html');
            };
            page.querySelector('#catBtn').onclick = function () {
                document.querySelector('#mainNavigator').pushPage('cat.html');
            };
            page.querySelector('#myAccBtn').onclick = function () {

                document.querySelector('#mainNavigator').pushPage('myAcc.html');
            };
            page.querySelector('#tuploadBtn').onclick = function () {

                document.querySelector('#mainNavigator').pushPage('uploading.html');
            };


        }

        if (page.id === 'home') {
            //Navigator
            nav();

            myNavigator.onDeviceBackButton=(function (event) {
                ons.notification.confirm('Do you want to close the app?') // Ask for confirmation
                  .then(function (index) {
                      if (index === 1) { // OK button
                          navigator.app.exitApp(); // Close the app
                      }
                  });
            });
            var mainwall = page.querySelector('#mainwall');
            //Feed Engine
            function mainwallEngine()
            {  
                var userId = firebase.auth().currentUser;
                if (userId.emailVerified) {
                    console.log('Email is verified at Home Wall');
                }
                else {
                    page.querySelector('#pageLoaging').innerHTML = '<ons-list-item ><div class="center">Verify your account to populate this feed</div></ons-list-item >';
                    console.log('Email is not verified at Home Wall');

                }

                firebase.database().ref("wallpaperDB/").orderByChild('likes').on("child_added", function (data)
                {
                    firebase.storage().ref('wid/' + data.key + '.jpeg').getDownloadURL().then(function (url)
                    {
                        firebase.database().ref('/userDB/' + userId.uid + '/wallpaperLiked/' + data.key).once('value').then(function (userWallLoop)
                        {
                            firebase.database().ref('/userDB/' + data.val().uid + '/followedBy/').on('value', function (followersLoop)
                            {
                                firebase.database().ref('/userDB/' + userId.uid + '/following/').on("child_added", function (following) {
                                
                                    if (userWallLoop.val() === true)
                                    {
                                        //Not printing liked contents
                                    }
                                    else {
                                        if (following.key === data.val().uid)
                                        {
                                        //display wallpaper                                      
                                        page.querySelector('#pageLoaging').style.display = "none";
                                        mainwall.appendChild(ons._util.createElement(
                                        '<div><ons-list-item tappable ripple modifier="nodivider" id="' + data.val().uid + 'User">'
                                        +'<div class="left"><img class="list__item__thumbnail" id="' + data.val().uid + 'DP" src="images/icon-user-default.png" width="40" height="40"></div>'
                                        +'<div class="center" style="padding:0px 0px 0px 0px;">'
                                        +'<span class="list__item__title" >' + data.val().uname + '</span>'
                                        +'<span class="list__item__subtitle">Followers : ' + followersLoop.val().followedByInt + '</span>'
                                        +'</div></ons-list-item>'
                                        +'<ons-list-item ripple style="padding:0px 0px 0px 0px;" modifier="nodivider">'
                                        +'<div class="center" style="padding:0px 0px 0px 0px;">'
                                        +'<img style="max-width:100%; width:100%;" src="'+url+'" alt="Loading....." /> '
                                        +'<table style="font-size:10px;opacity:0.87;padding-left:10px;">'
                                        + '<tr><td id="' + data.key + 'Likes">'+ data.val().likes+'</td><td>Likes</td><td></td>'
                                        + '<td id="' + data.key + 'Downloads">'+ data.val().downloads+'</td><td>Downloads</td><td></td>'                                   
                                        +'</tr></table></div></ons-list-item>'
                                        +'<ons-list-item style="padding:0px 0px 0px 0px;border-bottom:8px solid #e2e2e2;" modifier="nodivider">'
                                        +'<div class="center" style="padding:0px 0px 0px 0px;">'                                  
                                        +'<ons-button modifier="quiet" id="' + data.key + 'OnLike" style="font-size:10px;height:auto;width:auto;">Like</ons-button>'               
                                        +'<ons-button modifier="quiet" id="' + data.key + 'OnDownload" style="font-size:10px;height:auto;width:auto;"><a style="text-decoration: none;color:inherit;" href="' + url + '" download="' + data.key + '">Download</a></ons-button>'                               
                                        +'</div><div class="right" style="padding:0px 0px 0px 0px;">'
                                        +'<ons-button modifier="quiet" id="' + data.key + 'OnReport" style="font-size:10px;height:auto;width:auto;">Report</ons-button>'
                                        +'</div></ons-list-item></div>'));
    
                                        //Cheack Email Verification
                                        if (userId.emailVerified)
                                        {
                                            console.log('Email is verified at Home Wall');
                                        }
                                        else
                                        {
                                            page.querySelector('#'+data.key + 'OnLike').setAttribute("disabled", "true");
                                            page.querySelector('#'+data.key + 'OnDownload').setAttribute("disabled", "true");
                                            page.querySelector('#'+data.key + 'OnReport').setAttribute("disabled", "true");
                                            console.log('Email is not verified at Home Wall');

                                        }

                                        //onDPLoad
                                        firebase.storage().ref('profilePicture/' + data.val().uid + '/dp.jpeg').getDownloadURL().then(function (urlDP) {
                                            var DPClassId = document.querySelectorAll('#' + data.val().uid + 'DP');
                                            for (var i = 0; i < DPClassId.length; i++) {
                                                DPClassId[i].setAttribute('src', urlDP);

                                            }
                                        }).catch(function (error) {});
                                        //onProfile Click                                                                                  
                                        var profileClassId = document.querySelectorAll('#' + data.val().uid + "User");

                                        for (var i = 0; i < profileClassId.length; i++) {

                                            profileClassId[i].onclick = function () {
                                                onClickData(data);
                                                document.querySelector('#mainNavigator').pushPage('profile.html');
                                            }
                                        };
                                        document.addEventListener("show", function (event) {
                                            if (event.target.id === 'profile') {
                                                profileEngine();                                      
                                            }
                                        });
                                        // onLike Click
                                        page.querySelector('#'+data.key + 'OnLike').onclick = function ()
                                        {
                                            firebase.database().ref('/userDB/' + userId.uid + '/wallpaperLiked/' + data.key).set(true);
                                            firebase.database().ref('wallpaperDB/' + data.key).child('likes').set(data.val().likes + 1);
                                            this.setAttribute("disabled", "true");
                                            firebase.database().ref("wallpaperDB/").orderByChild('likes').on("child_added", function (data) {
                                                if (page.querySelector('#' + data.key + 'Likes')) {
                                                    //console.log("Updating Likes .....");
                                                    page.querySelector('#' + data.key + 'Likes').innerHTML = data.val().likes;
                                                }

                                            });
                                            console.log('Liked');
                                        };

                                        // onDownload Click
                                        page.querySelector('#' + data.key + 'OnDownload').onclick = function ()
                                        {
                                            firebase.database().ref('wallpaperDB/' + data.key).child('downloads').set(data.val().downloads + 1);
                                            firebase.database().ref("wallpaperDB/").orderByChild('downloads').on("child_added", function (data) {
                                                if (page.querySelector('#' + data.key + 'Downloads')) {
                                                    //console.log("Updating Downloads .....");
                                                    page.querySelector('#' + data.key + 'Downloads').innerHTML = data.val().likes;
                                                }

                                            });
                                            var dialog = page.querySelector('#downloadingid');
                                            if (dialog)
                                            {
                                                dialog.show();
                                                dialog.hide();
                                            }
                                            else
                                            {
                                                ons.createDialog('downloading.html')
                                                .then(function (dialog) {
                                                    dialog.show();
                                                    dialog.hide();
                                                });
                                            }
                                            var fileTransfer = new FileTransfer();
                                            var fileURL = "///storage/emulated/0/MyWallpapers/wall" + data.key + ".jpeg";
                                            fileTransfer.download(
                                               url, fileURL, function (entry)
                                               {
                                                   ons.notification.confirm("Download completed");
                                               },

                                               function (error)
                                               {
                                                   ons.notification.confirm("Download error source :" + error.source);
                                                   ons.notification.confirm("Download error target :" + error.target);
                                                   ons.notification.confirm("Download error code :" + error.code);
                                               },
                                               false, {
                                                   headers:
                                                   {
                                                       "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                                                   }
                                               }
                                            );
                                        };                                   
                                        // onReport Click
                                        page.querySelector('#' + data.key + 'OnReport').onclick = function ()
                                        {
                                            document.getElementById('popoverReport').show(page.querySelector('#' + data.key + 'OnReport'));
                                            document.querySelector('#reportBtn').onclick = function ()
                                            {
                                            
                                                if (document.getElementById('radio-1-r').checked === true) {
                                                    firebase.database().ref('Report/' + data.key ).set('Copyright Violation');
                                                }
                                                else if (document.getElementById('radio-2-r').checked === true) {
                                                    firebase.database().ref('Report/' + data.key).set('Spam');
                                                }
                                                else if (document.getElementById('radio-3-r').checked === true) {
                                                    firebase.database().ref('Report/' + data.key).set('Offensive Material');
                                                }
                                                ons.notification.alert("Reported Successfully");
                                                console.log("reported " +data.key);
                                                document.getElementById('popoverReport').hide(page.querySelector('#' + data.key + 'OnReport'));
                                            };
                                            document.querySelector('#reportCancelBtn').onclick = function ()
                                            {
                                                document.getElementById('popoverReport').hide(page.querySelector('#' + data.key + 'OnReport'));
                                            };

                                        };
                                       
                                    };
                               
                                }
                            });

                            });
                        }).catch(function (error)
                        {
                            console.log("Fetch Validating Error:" + error);
                        });
                    }).catch(function (error) { console.log("Stroage Fetching error :" + error); });
                });
                // On Refresh
                function statsUpdate() {
                    firebase.database().ref("wallpaperDB/").orderByChild('likes').on("child_added", function (data) {
                        if ( page.querySelector('#'+data.key + 'Likes')) {
                            //console.log("Updating Likes .....");
                            page.querySelector('#' + data.key + 'Likes').innerHTML = data.val().likes;
                        }

                    });
                    firebase.database().ref("wallpaperDB/").orderByChild('downloads').on("child_added", function (data) {
                        if (page.querySelector('#' + data.key + 'Downloads')) {
                            //console.log("Updating Downloads .....");
                            page.querySelector('#' + data.key + 'Downloads').innerHTML = data.val().likes;
                        }

                    });
                }
                // SET On Refresh--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                //setInterval(statsUpdate, 5000);
          
            } 
            //Pull to refresh
            var pullhookmainwall = page.querySelector('#pull-hook-mainwall');
            pullhookmainwall.addEventListener('changestate', function (event) {
                var message = '';

                switch (event.state) {
                    case 'initial':
                        message = 'Pull to refresh';
                        break;
                    case 'preaction':
                        message = 'Release';
                        break;
                    case 'action':
                        message = 'Loading...';
                        mainwall.innerHTML = "";
                        mainwallEngine();
                        break;
                }

                pullhookmainwall.innerHTML = message;
            });
            pullhookmainwall.onAction = function (done) {
                setTimeout(done, 1000);
            };
            //Pull to refresh End

            //Init Engine
            mainwallEngine();

        }

        else if (page.id === 'myAcc') {
            //Navigator
            myNavigator.onDeviceBackButton = (function (event) {
                document.querySelector('#mainNavigator').pushPage('home.html');
            });
            nav();

            var userId = firebase.auth().currentUser;
            page.querySelector('#my-username').innerHTML = '@' + userId.displayName;
            firebase.database().ref('/userDB/' + userId.uid + '/fullname').once('value').then(function (data) {
                page.querySelector('#my-fullname').innerHTML = data.val();

            });
            firebase.database().ref('/userDB/' + userId.uid + '/followedBy/followedByInt').once('value').then(function (data)
            {
                page.querySelector('#my-followedBy').innerHTML = data.val();

            });
            firebase.database().ref('/userDB/' + userId.uid + '/following/followingInt').once('value').then(function (data) {
                page.querySelector('#my-following').innerHTML = data.val();

            });


            if (userId.photoURL) {
                page.querySelector('#profile-image-DP').setAttribute("src", userId.photoURL);
            }
   
            //Upload DP
            page.querySelector('#profileDPUpload').onchange = function () {

                document.getElementById('uploadingDialog').show();

                var fileTBU = page.querySelector('#profileDPUpload').files[0];
                if (fileTBU) {

                    var progressBar = document.getElementById('progessBar');
                    var stroageRef = firebase.storage().ref('profilePicture/' + userId.uid + '/dp.jpeg');
                    var task = stroageRef.put(fileTBU);
                    task.on('state_changed', function (snapshot) {
                        var per = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        progessBar.value = per;
                    }, function (error) {
                        document.getElementById('uploadingDialog').hide();
                        ons.notification.alert("An error has occurred!</br>" + error);
                    }, function () {
                        firebase.storage().ref('profilePicture/' + userId.uid + '/dp.jpeg').getDownloadURL().then(function (url)
                        {
                            userId.updateProfile({ photoURL: url }).then(function () { console.log(userId.photoURL);});
                                
                            page.querySelector('#profile-image-DP').setAttribute("src", url);
                        });
                        document.getElementById('uploadingDialog').hide();
                          
                    });                                 

                }
                else {               
                    document.getElementById('uploadingDialog').hide();
                }
            };

            //Logout
            page.querySelector('#logoutBtn').onclick = function () {
            
                firebase.auth().signOut().then(function () {
                    ons.notification.confirm("Logout Successful");
                    document.querySelector('#mainNavigator').pushPage('login.html');
                }, function (error) {
                    ons.notification.alert("Error ! Try again");
                });
            };

            //Logout End
        }
 
        else if (page.id === 'uploading') {
            //Navigator
            nav();
            myNavigator.onDeviceBackButton = (function (event) {
                document.querySelector('#mainNavigator').pushPage('home.html');
            });
            //Check Email verification
            var userId = firebase.auth().currentUser;
            var uploadBtn = page.querySelector('#fileToUpload');
            if (userId.emailVerified) {
                uploadBtn.setAttribute('disabled', '');
                uploadBtn.removeAttribute('disabled');
                page.querySelector('#fileToUploadBtn').setAttribute('disabled','');
                page.querySelector('#fileToUploadBtn').removeAttribute('disabled');
                page.querySelector('#uploadWallpaperBtn').setAttribute('disabled','');
                page.querySelector('#uploadWallpaperBtn').removeAttribute('disabled');
            }
            else {
                uploadBtn.setAttribute('disabled', '');
                page.querySelector('#fileToUploadBtn').setAttribute('disabled', 'false');
                page.querySelector('#uploadWallpaperBtn').setAttribute('disabled', 'false');  
            }

            //Upload Wallpaper Engine
            page.querySelector('#fileToUpload').onchange = function () {

                var fileTBU = page.querySelector('#fileToUpload').files[0];
                if (fileTBU) {
                    var img = page.querySelector('#showWallImg');
                    var checkimg = new Image();
                    checkimg.src = window.URL.createObjectURL(fileTBU);
                    checkimg.onload = function () {
                        if (checkimg.width === 1080 && checkimg.height === 1920) {
                            img.src = window.URL.createObjectURL(fileTBU);
                            page.querySelector('#uploadWallpaperBtn').onclick = function () {
                                var catval;
                                if (document.getElementById('radio-1').checked === true) {
                                    catval = 'animals';
                                }
                                else if (document.getElementById('radio-2').checked === true) {
                                    catval = 'cartoons';
                                }
                                else if (document.getElementById('radio-3').checked === true) {
                                    catval = 'quotes';
                                }

                                if (catval !== null) {
                                    document.getElementById('uploadingDialog').show();
                                    var progressBar = page.querySelector('#progessBar');
                                    var newPostKey = firebase.database().ref().child('wallpaperDB').push().key;
                                    var stroageRef = firebase.storage().ref('wid/' + newPostKey + '.jpeg');
                                    var task = stroageRef.put(fileTBU);
                                    task.on('state_changed', function (snapshot) {
                                        var per = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                        progessBar.value = per;
                                    }, function (error) {
                                        document.getElementById('uploadingDialog').hide();
                                        ons.notification.alert("An error has occurred!</br>" + error);
                                    }, function () {
                                        //get current user
                                        var userId = firebase.auth().currentUser;
                                        //set wallpaper on db    
                                        firebase.database().ref('wallpaperDB/' + newPostKey + '/').set({ uname: userId.displayName, uid: userId.uid, likes: 1, downloads: 1, cat: catval });
                                        //set wallpaper on userdb
                                        firebase.database().ref('userDB/' + userId.uid + '/uploads/' + newPostKey).set(true);
                                        firebase.database().ref('userDB/' + userId.uid + '/wallpaperLiked/' + newPostKey).set(true);
                                        document.getElementById('uploadingDialog').hide();
                                        ons.notification.confirm("Uploaded Successfully");
                                        document.querySelector('#mainNavigator').pushPage('home.html');
                                    });
                                }
                                else { ons.notification.alert('Select a catagory'); }
                            }
                        }
                        else {
                            ons.notification.confirm("You can't upload Low Quality Wallpapers ! Wallpaper must have Heigh 1920 and Width 1080");
                            document.getElementById('uploadingDialog').hide();
                        }
                    }
                }
                else {
                    console.log("error");
                    ons.notification.alert("Oh No an error ! Try again");
                    document.getElementById('uploadingDialog').hide();
                }
            };
            //Uploading Wallpaper End

        }

        else if (page.id === 'myUpd') {         
            //Navigator
            nav();
            myNavigator.onDeviceBackButton = (function (event) {
                document.querySelector('#mainNavigator').pushPage('home.html');
            });
            var uwall = page.querySelector('#myUpdWall');
            // Feed Engine
            function uwallEngine() {

                var userId = firebase.auth().currentUser;
                if (userId.emailVerified) {
                    console.log('Email is verified at Home Wall');
                }
                else {
                    page.querySelector('#pageLoaging').innerHTML = '<ons-list-item ><div class="center">Verify your account to populate this feed.</div></ons-list-item >';
                    console.log('Email is not verified at Home Wall');

                }
                firebase.database().ref("wallpaperDB/").orderByChild('likes').on("child_added", function (data) {
                    firebase.storage().ref('wid/' + data.key + '.jpeg').getDownloadURL().then(function (url) {
                        firebase.database().ref('/userDB/' + userId.uid + '/wallpaperLiked/' + data.key).once('value').then(function (snapshot) {
                            firebase.database().ref('/userDB/' + data.val().uid + '/followedBy/').on('value', function (followersLoop) {
                                if (snapshot.val() === true) {
                                    page.querySelector('#pageLoaging').style.display = "none";
                                    uwall.appendChild(ons._util.createElement(
                                        '<div><ons-list-item tappable ripple modifier="nodivider" id="' + data.val().uid + 'User">'
                                        + '<div class="left"><img class="list__item__thumbnail" id="' + data.val().uid + 'DP" src="images/icon-user-default.png" width="40" height="40"></div>'
                                        + '<div class="center" style="padding:0px 0px 0px 0px;">'
                                        + '<span class="list__item__title" >' + data.val().uname + '</span>'
                                        + '<span class="list__item__subtitle">Followers : ' + followersLoop.val().followedByInt + '</span>'
                                        + '</div></ons-list-item>'
                                        + '<ons-list-item ripple style="padding:0px 0px 0px 0px;" modifier="nodivider">'
                                        + '<div class="center" style="padding:0px 0px 0px 0px;">'
                                        + '<img style="max-width:100%; width:100%;" src="' + url + '" alt="Loading....." /> '
                                        + '<table style="font-size:10px;opacity:0.87;padding-left:10px;">'
                                        + '<tr><td Likes">' + data.val().likes + '</td><td>Likes</td><td></td>'
                                        + '<td Downloads">' + data.val().downloads + '</td><td>Downloads</td><td></td>'
                                        + '</tr></table></div></ons-list-item>'
                                        + '<ons-list-item style="padding:0px 0px 0px 0px;border-bottom:8px solid #e2e2e2;" modifier="nodivider">'
                                        + ' <div class="center" style="padding:0px 0px 0px 0px;">'
                                        + '<ons-button modifier="quiet" id="' + data.key + 'OnDownload" style="font-size:10px;height:auto;width:auto;"><a style="text-decoration: none;color:inherit;" href="' + url + '" download="' + data.key + '">Download</a></ons-button>'
                                        + '</div><div class="right" style="padding:0px 0px 0px 0px;">'
                                        + '<ons-button modifier="quiet" id="' + data.key + 'OnReport" style="font-size:10px;height:auto;width:auto;">Report</ons-button>'
                                        + '</div></ons-list-item></div>'));
                                    if (userId.emailVerified) {
                                        console.log("Email verified at Upload Wall");
                                    }
                                    else {
                                        console.log("Email not verified at Upload Wall");
                                        page.querySelector('#' + data.key + 'OnReport').setAttribute("disabled", "");
                                        page.querySelector('#' + data.key + 'OnDownload').setAttribute("disabled", "");
                                    }

                                    //onDPLoad
                                    firebase.storage().ref('profilePicture/' + data.val().uid + '/dp.jpeg').getDownloadURL().then(function (urlDP) {
                                        var DPClassId = document.querySelectorAll('#' + data.val().uid + 'DP');
                                        for (var i = 0; i < DPClassId.length; i++) {
                                            DPClassId[i].setAttribute('src', urlDP);

                                        }
                                    }).catch(function (error) {
                                    });

                                    //onProfile Click                                                                                  
                                    var profileClassId = document.querySelectorAll('#' + data.val().uid + "User");
                                    for (var i = 0; i < profileClassId.length; i++) {
                                        profileClassId[i].onclick = function () {
                                            onClickData(data);
                                            document.querySelector('#mainNavigator').pushPage('profile.html');
                                        }
                                    };
                                    document.addEventListener("show", function (event) {
                                        if (event.target.id === 'profile') {
                                            profileEngine();
                                        }
                                    });
                                    //OnDownload Click
                                    page.querySelector('#' + data.key + 'OnDownload').onclick = function () {
                                        firebase.database().ref('wallpaperDB/' + data.key).child('downloads').set(data.val().downloads + 1);
                                        firebase.database().ref("wallpaperDB/").orderByChild('downloads').on("child_added", function (data) {
                                            if (page.querySelector('#' + data.key + 'Downloads')) {
                                                //console.log("Updating Downloads .....");
                                                page.querySelector('#' + data.key + 'Downloads').innerHTML = data.val().likes;
                                            }

                                        });
                                        var dialog = page.querySelector('#downloadingid');

                                        if (dialog) {
                                            dialog.show();
                                            dialog.hide();

                                        }
                                        else {
                                            ons.createDialog('downloading.html')
                                            .then(function (dialog) {
                                                dialog.show();
                                                dialog.hide();
                                            });
                                        }
                                        var fileTransfer = new FileTransfer();

                                        var fileURL = "///storage/emulated/0/MyWallpapers/wall" + data.key + ".jpeg";

                                        fileTransfer.download(
                                           url, fileURL, function (entry) {

                                               ons.notification.confirm("Download completed");
                                           },

                                           function (error) {

                                               ons.notification.confirm("Download error source :" + error.source);
                                               ons.notification.confirm("Download error target :" + error.target);
                                               ons.notification.confirm("Download error code :" + error.code);
                                           },

                                           false, {
                                               headers: {
                                                   "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                                               }
                                           }
                                        );

                                    };
                                    // onReport Click
                                    page.querySelector('#' + data.key + 'OnReport').onclick = function () {
                                        document.getElementById('popoverReport').show(page.querySelector('#' + data.key + 'OnReport'));
                                        document.querySelector('#reportBtn').onclick = function () {

                                            if (document.getElementById('radio-1-r').checked === true) {
                                                firebase.database().ref('Report/' + data.key).set('Copyright Violation');
                                            }
                                            else if (document.getElementById('radio-2-r').checked === true) {
                                                firebase.database().ref('Report/' + data.key).set('Spam');
                                            }
                                            else if (document.getElementById('radio-3-r').checked === true) {
                                                firebase.database().ref('Report/' + data.key).set('Offensive Material');
                                            }
                                            ons.notification.alert("Reported Successfully");
                                            console.log("reported " + data.key);
                                            document.getElementById('popoverReport').hide(page.querySelector('#' + data.key + 'OnReport'));
                                        };
                                        document.querySelector('#reportCancelBtn').onclick = function () {
                                            document.getElementById('popoverReport').hide(page.querySelector('#' + data.key + 'OnReport'));
                                        };

                                    };


                                }
                            });

                        }).catch(function (error) {
                            console.log("Fetch Validating Error:" + error);
                        });
                    }).catch(function (error) { console.log("Stroage Fetching error :" + error); });
                });
            };
            //Pull to refresh upload wallpaper
            var pullhookuwall = page.querySelector('#pull-hook-uwall');
            pullhookuwall.addEventListener('changestate', function (event) {
                var message = '';
                switch (event.state) {
                    case 'initial':
                        message = 'Pull to refresh';
                        break;
                    case 'preaction':
                        message = 'Release';
                        break;
                    case 'action':
                        message = 'Loading...';
                        uwall.innerHTML = "";
                        uwallEngine();
                        break;
                }

                pullhookuwall.innerHTML = message;
            });
            pullhookuwall.onAction = function (done) {
                setTimeout(done, 1000);
            };
            //Pull to refresh upload wallpaper End


            //Init upload wallpaper
            uwallEngine();

        }

        else if (page.id === 'cat') {
            //Navigator
            nav();
            myNavigator.onDeviceBackButton = (function (event) {
                document.querySelector('#mainNavigator').pushPage('home.html');
            });
            myNavigator.onDeviceBackButton.disable();

            page.querySelector('#cat_animals').onclick = function () {
                onCatClick('animals');
                document.querySelector('#mainNavigator').pushPage('oncat.html',{data: {title: 'Animals'}});
            };

            page.querySelector('#cat_cartoons').onclick = function () {
                onCatClick('cartoons');
                document.querySelector('#mainNavigator').pushPage('oncat.html', { data: { title: 'Cartoons' } });
            };
            page.querySelector('#cat_quotes').onclick = function () {
                onCatClick('quotes');
                document.querySelector('#mainNavigator').pushPage('oncat.html', { data: { title: 'Quotes' } });
            };

        }

        else if (page.id === 'oncat') {
            myNavigator.onDeviceBackButton.enable();
            page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
            function cwallEngine() {
                var cwall = page.querySelector('#cwall');
                var userId = firebase.auth().currentUser;
                firebase.database().ref("wallpaperDB/").orderByChild('likes').on("child_added", function (data) {
                    firebase.storage().ref('wid/' + data.key + '.jpeg').getDownloadURL().then(function (url) {
                        firebase.database().ref('/userDB/' + userId.uid + '/wallpaperLiked/' + data.key).once('value').then(function (userWallLoop) {
                            firebase.database().ref('/userDB/' + data.val().uid + '/followedBy/').on('value', function (followersLoop) {
                                if (userWallLoop.val() === true) {
                                    //Not printing liked contents
                                }
                                else {                         
                                    if (data.val().cat === '' + onCatClickVar + '') {
                                        //display wallpaper 
                                        page.querySelector('#pageLoaging').style.display = "none";             
                                        cwall.appendChild(ons._util.createElement(
                                        '<div><ons-list-item tappable ripple modifier="nodivider" id="' + data.val().uid + 'User">'
                                        + '<div class="left"><img class="list__item__thumbnail" id="' + data.val().uid + 'DP" src="images/icon-user-default.png" width="40" height="40"></div>'
                                        + '<div class="center" style="padding:0px 0px 0px 0px;">'
                                        + '<span class="list__item__title" >' + data.val().uname + '</span>'
                                        + '<span class="list__item__subtitle">Followers : ' + followersLoop.val().followedByInt + '</span>'
                                        + '</div></ons-list-item>'
                                        + '<ons-list-item ripple style="padding:0px 0px 0px 0px;" modifier="nodivider">'
                                        + '<div class="center" style="padding:0px 0px 0px 0px;">'
                                        + '<img style="max-width:100%; width:100%;" src="' + url + '" alt="Loading....." /> '
                                        + '<table style="font-size:10px;opacity:0.87;padding-left:10px;">'
                                        + '<tr><td id="' + data.key + 'Likes">' + data.val().likes + '</td><td>Likes</td><td></td>'
                                        + '<td id="' + data.key + 'Downloads">' + data.val().downloads + '</td><td>Downloads</td><td></td>'
                                        + '</tr></table></div></ons-list-item>'
                                        + '<ons-list-item style="padding:0px 0px 0px 0px;border-bottom:8px solid #e2e2e2;" modifier="nodivider">'
                                        + '<div class="center" style="padding:0px 0px 0px 0px;">'
                                        + '<ons-button modifier="quiet" id="' + data.key + 'OnLike" style="font-size:10px;height:auto;width:auto;">Like</ons-button>'
                                        + '<ons-button modifier="quiet" id="' + data.key + 'OnDownload" style="font-size:10px;height:auto;width:auto;"><a style="text-decoration: none;color:inherit;" href="' + url + '" download="' + data.key + '">Download</a></ons-button>'
                                        + '</div><div class="right" style="padding:0px 0px 0px 0px;">'
                                        + '<ons-button modifier="quiet" id="' + data.key + 'OnReport" style="font-size:10px;height:auto;width:auto;">Report</ons-button>'
                                        + '</div></ons-list-item></div>'));

                                        //Cheack Email Verification
                                        if (userId.emailVerified) {
                                            console.log('Email is verified at Cat Wall');
                                        }
                                        else {
                                            page.querySelector('#' + data.key + 'OnLike').setAttribute("disabled", "true");
                                            page.querySelector('#' + data.key + 'OnDownload').setAttribute("disabled", "true");
                                            page.querySelector('#' + data.key + 'OnReport').setAttribute("disabled", "true");
                                            console.log('Email is not verified at Cat Wall');

                                        }

                                        //onDPLoad
                                        firebase.storage().ref('profilePicture/' + data.val().uid + '/dp.jpeg').getDownloadURL().then(function (urlDP) {
                                            var DPClassId = document.querySelectorAll('#' + data.val().uid + 'DP');
                                            for (var i = 0; i < DPClassId.length; i++) {
                                                DPClassId[i].setAttribute('src', urlDP);

                                            }
                                        }).catch(function (error) { });


                                        //onProfile Click                                                                                  
                                        var profileClassId = document.querySelectorAll('#' + data.val().uid + "User");

                                        for (var i = 0; i < profileClassId.length; i++) {

                                            profileClassId[i].onclick = function () {
                                                onClickData(data);
                                                document.querySelector('#mainNavigator').pushPage('profile.html');
                                            }
                                        };
                                        document.addEventListener("show", function (event) {
                                            if (event.target.id === 'profile') {
                                                profileEngine();
                                            }
                                        });

                                        // onLike Click
                                        page.querySelector('#' + data.key + 'OnLike').onclick = function () {
                                            console.log('Liked');
                                            firebase.database().ref('/userDB/' + userId.uid + '/wallpaperLiked/' + data.key).set(true);
                                            firebase.database().ref('wallpaperDB/' + data.key).child('likes').set(data.val().likes + 1);
                                            this.setAttribute("disabled", "true");
                                            firebase.database().ref("wallpaperDB/").orderByChild('likes').on("child_added", function (data) {
                                                if (page.querySelector('#' + data.key + 'Likes')) {
                                                    //console.log("Updating Likes .....");
                                                    page.querySelector('#' + data.key + 'Likes').innerHTML = data.val().likes;
                                                }

                                            });
                                            console.log('Liked');
                                        };

                                        // onDownload Click
                                        page.querySelector('#' + data.key + 'OnDownload').onclick = function () {
                                            firebase.database().ref('wallpaperDB/' + data.key).child('downloads').set(data.val().downloads + 1);
                                            firebase.database().ref("wallpaperDB/").orderByChild('downloads').on("child_added", function (data) {
                                                if (page.querySelector('#' + data.key + 'Downloads')) {
                                                    //console.log("Updating Downloads .....");
                                                    page.querySelector('#' + data.key + 'Downloads').innerHTML = data.val().likes;
                                                }

                                            });
                                            var dialog = page.querySelector('#downloadingid');
                                            if (dialog) {
                                                dialog.show();
                                                dialog.hide();
                                            }
                                            else {
                                                ons.createDialog('downloading.html')
                                                .then(function (dialog) {
                                                    dialog.show();
                                                    dialog.hide();
                                                });
                                            }
                                            var fileTransfer = new FileTransfer();
                                            var fileURL = "///storage/emulated/0/MyWallpapers/wall" + data.key + ".jpeg";
                                            fileTransfer.download(
                                               url, fileURL, function (entry) {
                                                   ons.notification.confirm("Download completed");
                                               },

                                               function (error) {
                                                   ons.notification.confirm("Download error source :" + error.source);
                                                   ons.notification.confirm("Download error target :" + error.target);
                                                   ons.notification.confirm("Download error code :" + error.code);
                                               },
                                               false, {
                                                   headers:
                                                   {
                                                       "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                                                   }
                                               }
                                            );
                                        };
                                        // onReport Click
                                        page.querySelector('#' + data.key + 'OnReport').onclick = function () {
                                            document.getElementById('popoverReport').show(page.querySelector('#' + data.key + 'OnReport'));
                                            document.querySelector('#reportBtn').onclick = function () {

                                                if (document.getElementById('radio-1-r').checked === true) {
                                                    firebase.database().ref('Report/' + data.key).set('Copyright Violation');
                                                }
                                                else if (document.getElementById('radio-2-r').checked === true) {
                                                    firebase.database().ref('Report/' + data.key).set('Spam');
                                                }
                                                else if (document.getElementById('radio-3-r').checked === true) {
                                                    firebase.database().ref('Report/' + data.key).set('Offensive Material');
                                                }
                                                ons.notification.alert("Reported Successfully");
                                                console.log("reported " + data.key);
                                                document.getElementById('popoverReport').hide(page.querySelector('#' + data.key + 'OnReport'));
                                            };
                                            document.querySelector('#reportCancelBtn').onclick = function () {
                                                document.getElementById('popoverReport').hide(page.querySelector('#' + data.key + 'OnReport'));
                                            };

                                        };
                                    }


                                }

                            });
                        }).catch(function (error) {
                            console.log("Fetch Validating Error:" + error);
                        });
                    }).catch(function (error) { console.log("Stroage Fetching error :" + error); });
                });
            }
            //Initiate Engine
            cwallEngine();
        }

    });
    //Main End