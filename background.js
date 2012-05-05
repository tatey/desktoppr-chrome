var API = {
  BaseURL: function() {
    this.protocol = 'https';
    this.host     = 'api.desktoppr.co';
    this.version  = '1';

    this.urlByAppendingPath = function(path) {
      return this.protocol + '://' + this.host + '/1' + path ;
    };

    return this;
  },

  User: function(username) {
    this.baseURL  = new API.BaseURL();
    this.username = username;

    this.getRandomWallpaperURL = function(callback) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var json = JSON.parse(xhr.response);
          callback(json.response.image.url);
        }
      }
      xhr.open("GET", this.baseURL.urlByAppendingPath('/users/' + this.username + '/wallpapers/random'), true);
      xhr.send();
    };
  }
};

var Cache = function() {
  this.storage = window.localStorage;
  this.images  = JSON.parse(this.storage.getItem('cache') || '[]');

  this.addImage = function(image) {
    this.images.push(image);
    this.save();
  };

  this.save = function() {
    this.storage.setItem('cache', JSON.stringify(this.images));
  };

  this.username = function() {
    return this.storage.getItem('username') || 'keithpitt';
  }

  return this;
};

var Loader = function() {
  var _isExecuting = false;

  this.cache = new Cache();
  this.user  = new API.User(this.cache.username());

  this.load = function() {
    if (_isExecuting) return;
    _isExecuting = true;
    var _this = this;
    this.user.getRandomWallpaperURL(function(url) {
      var image    = new Image();
      image.onload = function() {
        _this.cache.addImage({url: url});
        _isExecuting = false;
      };
      image.src = url;
    });
  };

  return this;
};

window.loader = new Loader();

window.tabDidLoad = function() {
  loader.load();
};
