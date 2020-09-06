### 使用express生成器
1、项目创建:
```
npm install express-generator -g
express --view=ejs node-server-api
cd node-server-api
npm install
npm start
```
2、在package.json文件中配置
```
"start": "nodemon ./bin/www"
```
使用nodemon的方式运行node，这样可热更新。
安装nodemon
```
npm install nodemon -g
```
3、项目目录(这是一个前后端不分离的项目MVC)
bin   入口文件是 /bin/www 
public  存放静态资源、静态路径
model  进数据库操作的增、删、改、查 (M)
views   是EJS模板引擎  (V)
router   路由      (C)
api.js