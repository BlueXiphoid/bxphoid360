/****************************************
*
*
*
*         treesixty
*
*
*
****************************************/
var IMAGES = new Array();
(function($) {
  console.log("exists");
  $.bxphoid = $.bxphoid || {version: "1.0"}

  $.bxphoid.treesixty = {

    conf: {
      preloadImages: true,
      start: 1,
      current: 1,
      nicenumber: true,
      duration: 100,
      durationIsTotalDuration: true,
      width_step: 10,
      usesrc: true
    }
  }

  function treesixty(el, conf) {
    var self = this,
    fire = el.add(self),
    uid = Math.random().toString().slice(10);
    $.extend(self, {

      show: function() {
        el.show();
      },

      nicenumber: function(n) {
        if(n < 10) return String("0" + n);
        return String(n);
      },

      getCurrentFrame: function() {
        return el.attr('frame');
      },

      getTotal: function() {
        return el.attr('total');
      },

      getPrefix: function() {
        return el.attr('prefix');
      },

      getExtension: function() {
        return el.attr('extension');
      },

      mustStop: function() {
        return el.hasClass("stop");
      },

      showFrame: function(n) {
        el.attr('src', self.getPrefix() + self.nicenumber(n) + self.getExtension());
      },

      start: function(opts) {
        opts = opts || {}
        opts.limit = opts.limit || conf.amount
        opts.speed = opts.speed || conf.speed
        self.run(opts);
      },

      stop: function() {
        el.addClass('stop');
      },

      reset: function() {
        el.removeClass('stop');
        el.attr({'prefix': conf.prefix, 'extension': conf.extension, 'frame': conf.start, 'total': conf.amount});
      },

      calcSpeed: function(s,l) {
        if(conf.durationIsTotalDuration) {
          return s/l;
        }
        return s;
      },

      run: function(opts) {
        if(self.mustStop()) {
          el.removeClass("stop");
        } else {
          cont = false;
          self.showFrame(self.nicenumber(Number(self.getCurrentFrame()) + 1));
          el.attr('frame', Number(self.getCurrentFrame()) + 1);
          if(self.getCurrentFrame() < opts.limit) {
            cont = true;
          }
          if(cont) {
            setTimeout(function(){
              self.run(opts);
            }, self.calcSpeed(opts.speed, opts.limit));
          }
        }
      },

      startDragging: function() {
        el.addClass('dragging')
      },

      stopDragging: function() {
        el.removeClass('dragging');
      },

      isDragging: function() {
        return el.hasClass('dragging');
      },

      setLastX: function(x) {
        el.attr('lastx', x);
      },

      getLastX: function() {
        return el.attr('lastx');
      }
    });

    self.reset();

    if(conf.preloadImages) {
      el.data.start = conf.start;
      for(i = conf.start; i <= conf.amount; i++) {
        c = IMAGES.length+1;
        IMAGES[c] = new Image();
        IMAGES[c].src = conf.prefix + self.nicenumber(i) + conf.extension;
      }
    }

    el.on('mousedown', function(e){
      self.startDragging();
      self.setLastX(e.clientX);
      e.preventDefault();
      e.stopPropagation();
    })


    $(document).on('mouseup', function(){
      self.stopDragging();
    })


    $(document).on('mousemove', function(e){
      if(!self.isDragging()) return;
      lastx = self.getLastX();
      if (Math.abs(e.clientX - lastx) >= conf.width_step) {
          if (e.clientX - lastx >= conf.width_step) {
            el.data.start--;
          } else {
            el.data.start++;
          }
          if (el.data.start > conf.amount) {
            el.data.start = conf.start
          }
          if (el.data.start < conf.start) {
              el.data.start = conf.amount
          }
          self.setLastX(e.clientX);
          self.showFrame(el.data.start)
      }
    })

    // callbacks
    $.each("".split(","), function(i, name) {
      // configuration
      if ($.isFunction(conf[name])) {
        $(self).on(name, conf[name]);
      }

      // API
      self[name] = function(fn) {
        if (fn) { $(self).on(name, fn); }
          return self;
        };
    });
  }

  $.fn.treesixty = function(conf) {

    var api = this.data("treesixty")
    if(api) { return api; }

    conf = $.extend({}, $.bxphoid.treesixty.conf, conf);

    this.each(function() {
      api = new treesixty($(this), conf);
      $(this).data("treesixty", api)
    });

    return api;
  }; 
})($);