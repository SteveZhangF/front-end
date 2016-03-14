module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //合并任务
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['app/scripts/*.js'],
        dest: 'dist/main.js'
      }
    },

    //压缩任务
    uglify: {
      options: {
        banner: '/*! build by steve */'
      },
      "my_target": {
        "files": {
          'dist/scripts/main.min.js': ['app/scripts/*.js','app/app/**/*.js'],
          'dist/scripts/vendor.min.js':['dist/lib/jquery/*.js',
            'dist/lib/jquery-cookie/*.js','dist/lib/store2/*.js']
        }
      }
    },

    //压缩css
    cssmin: {
      compress: {
        files: {
          'dist/styles/main.min.css': [
            "app/styles/main.css"
          ]
        }
      }
    },

// copy task
    copy: {
      src: {
        files: [
          {expand: true, cwd: 'app', src: ['**/*.html'], dest: 'dist/'},
          {expand:true,cwd:'app/lib2',src:['**/*'],dest:'dist/lib2'},
          {expand:true,cwd:'app/data',src:['*.json'],dest:'dist/data'},
        ]
      },
      image: {
        files: [
          {expand: true, cwd: 'app', src: ['images/**/*.{png,jpg,jpeg,gif}','*.ico'], dest: 'dist/'}
        ]
      }
    },

    // fix js/css url inhtml
    usemin: {
      html: 'dist/**/*.html'
    },

    // bower component
    bower: {
      install: {
        options: {
          targetDir: 'dist/lib',
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

  })
  ;


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
  grunt.registerTask('default', ['bower','copy','cssmin','uglify','usemin']);
}
;
