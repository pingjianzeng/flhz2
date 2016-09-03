var gulp = require("gulp"),
	less = require("gulp-less"),
	minCss = require("gulp-clean-css"),
	connect = require("gulp-connect"),
	uglify = require("gulp-uglify"),
	imagemin = require("gulp-imagemin"),
	concat = require("gulp-concat"),
	htmlmin = require("gulp-htmlmin"),
	autoprefixer = require("gulp-autoprefixer");

//配置监听
gulp.task("watch",function(){
	gulp.watch("src/less/*.less",["cssHandle","reload"]);
	gulp.watch("src/js/*.js",["scriptHandle","reload"]);
	gulp.watch("src/images/user/*.{jpg,png,gif,ico}",["imgHandle","reload"]);
	gulp.watch("src/dest/*.html",["htmlHandle","reload"]);
}); 

//css相关处理
gulp.task("cssHandle",function(){
	var af = {
		browsers: ['last 2 versions', 'Android >= 4.0',"iOS 7"]
	};
	gulp.src("src/less/*.less").pipe(less()).pipe(autoprefixer(af)).pipe(minCss()).pipe(gulp.dest("src/css"));
});

//本地web服务器
gulp.task("server",function(){
	connect.server({
		root:"src",
		port:801,
		livereload:true
	});
});

//处理js文件
gulp.task("scriptHandle",function(){
	gulp.src("src/js/*.js").pipe(uglify({
            mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
        })).pipe(gulp.dest("src/javascript"));
});

//html页面相关处理
gulp.task("htmlHandle",function(){
	var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
	gulp.src("src/dest/*.html").pipe(htmlmin(options)).pipe(gulp.dest("src/html"));
});


//图片相关处理
gulp.task("imgHandle",function(){
	gulp.src("src/images/user/*.{jpg,png,gif,ico}").pipe(imagemin()).pipe(gulp.dest("src/images"));
	gulp.src("src/images/user/*.{jpg,png,gif,ico}").pipe(gulp.dest("src/images"));
});

//预处理相关
gulp.task("allHandle",["htmlHandle","cssHandle","scriptHandle","imgHandle"]);
//刷新页面
gulp.task("reload",function(){
	gulp.src("src/html/*.html").pipe(connect.reload());
});

gulp.task("default",["allHandle","watch","server","imgHandle","htmlHandle","scriptHandle"]);