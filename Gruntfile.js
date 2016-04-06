module.exports = function (grunt) {
  // 项目配置
  var confg, properties;
  properties = {
    dist_development: "dist",
    dist_deploy: "/Users/steve/work/"
  },

    confg = {
      dist: properties.dist_deploy
    }
  function init() {

    var config = {
      pkg: grunt.file.readJSON('package.json'),

      //合并任务
      concat: {
        options: {
          separator: ';'
        },
        dist: {
          src: ['app/scripts/*.js'],
          dest: confg.dist + '/main.js'
        }
      },

      //压缩任务
      uglify: {
        options: {
          banner: '/*! build by steve */'
        },
        "my_target": {
          "files": {
            //'dist/scripts/main.min.js': ['app/scripts/*.js','app/app/**/*.js'],
            //'dist/scripts/vendor.min.js':[confg.dist+'/lib/jquery/*.js',
            //  confg.dist+'/lib/jquery-cookie/*.js',confg.dist+'/lib/store2/*.js']
          }
        }
      },

      //压缩css
      cssmin: {
        compress: {
          files: {}
        }
      },

// copy task
      copy: {
        src: {
          files: [
            {expand: true, cwd: 'app', src: ['**/*.html'], dest: confg.dist + '/'},
            {expand: true, cwd: 'app/lib2', src: ['**/*'], dest: confg.dist + '/lib2'},
            {expand: true, cwd: 'app/data', src: ['*.json'], dest: confg.dist + '/data'},
          ]
        },
        image: {
          files: [
            {expand: true, cwd: 'app', src: ['images/**/*.{png,jpg,jpeg,gif}', '*.ico'], dest: confg.dist}
          ]
        }
      },

      // fix js/css url inhtml
      usemin: {
        html: confg.dist + '/**/*.html'
      },

      // bower component
      bower: {
        install: {
          options: {
            targetDir: confg.dist + '/lib',
            layout: 'byComponent',
            install: true,
            verbose: false,
            cleanTargetDir: false,
            cleanBowerDir: false,
            bowerOptions: {}
          }
          //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
        }

      }

    };


    //'dist/scripts/main.min.js': ['app/scripts/*.js','app/app/**/*.js'],
    //'dist/scripts/vendor.min.js':[confg.dist+'/lib/jquery/*.js',
    //  confg.dist+'/lib/jquery-cookie/*.js',confg.dist+'/lib/store2/*.js']


    //initCon.uglify['my_target']={};
    //initCon.uglify['my_target']['files']={};
    config.uglify['my_target']['files'][confg.dist + '/scripts/main.min.js'] = ['app/scripts/*.js', 'app/app/**/*.js'];
    config.uglify['my_target']['files'][confg.dist + '/scripts/vendor.min.js'] = [confg.dist + '/lib/jquery/*.js',
      confg.dist + '/lib/jquery-cookie/*.js', confg.dist + '/lib/store2/*.js'];

    //'dist/styles/main.min.css': [
    //  "app/styles/main.css"
    //]
    config.cssmin.compress.files[confg.dist + '/styles/main.min.css'] = [
      "app/styles/main.css"
    ];

    return config;

  }


//'dist/scripts/main.min.js': ['app/scripts/*.js','app/app/**/*.js'],
  //'dist/scripts/vendor.min.js':[confg.dist+'/lib/jquery/*.js',
  //  confg.dist+'/lib/jquery-cookie/*.js',confg.dist+'/lib/store2/*.js']
  //加载合并任务
  grunt.loadNpmTasks('grunt-contrib-concat');
// 加载提供"uglify"任务的插件 压缩
  grunt.loadNpmTasks('grunt-contrib-uglify');
// 加载css压缩
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-bower-task');
// 默认任务
//  grunt.registerTask('default', [], function () {
//    console.log(confg.dist);
//  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  // 加载插件
  grunt.loadNpmTasks('grunt-contrib-connect');
  //
  //{
  //  var lrPort = 35729;
  //  // 使用connect-livereload模块，生成一个与LiveReload脚本
  //  // <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
  //  var lrSnippet = require('connect-livereload')({port: lrPort});
  //  // 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
  //  var lrMiddleware = function (connect, options) {
  //    return [
  //      lrSnippet,
  //      // 静态文件服务器的路径 原先写法：connect.static(options.base[0])
  //      serveStatic(options.base[0]),
  //      // 启用目录浏览(相当于IIS中的目录浏览) 原先写法：connect.directory(options.base[0])
  //      serveIndex(options.base[0])
  //    ];
  //  };
  //  grunt.initConfig({
  //
  //    connect: {
  //      server: {
  //        options: {
  //          port: 9000,
  //          base: 'app',
  //          keepalive: true,
  //          open: {
  //            target: 'http://localhost:9000'
  //          }
  //        }
  //      }
  //    },
  //    // 通过watch任务，来监听文件是否有更改
  //    watch: {
  //      client: {
  //        // 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。
  //        options: {
  //          livereload: lrPort
  //        },
  //        // '**' 表示包含所有的子目录
  //        // '*' 表示包含所有的文件
  //        files: ['app/**/*.html', 'app/*', 'app/styles/*', 'app/scripts/*', 'images/**/*']
  //      }
  //    }
  //  });
  //}
  //// 自定义任务
  //grunt.registerTask('live', ['connect', 'watch']);

  grunt.registerTask('serve', 'Compile ', function (target) {
    confg.dist = properties['dist_' + target];
    grunt.initConfig(init());
    grunt.task.run([
      'bower', 'copy', 'cssmin', 'uglify', 'usemin'
    ]);
  });
}
;







