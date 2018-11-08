import {Application} from 'pinus/lib/application';

let mysql = require('mysql');

export class MysqlMgr {
    private mPool;

    constructor(app: Application) {
        let mysqlConfig = app.get('mysql');
        this.mPool = mysql.createPool({
            host: mysqlConfig.host,
            user: mysqlConfig.user,
            password: mysqlConfig.password,
            database: mysqlConfig.database,
            port: mysqlConfig.port
        });
    }

    query(sql, args, callback) {
        this.mPool.getConnection(function(err, conn) {
            if(err) {
                callback(err, null);
            } else {
                // 这里返回的参数可以改变一下 直接取到查询结果
                conn.query(sql, args, function(err, res) {
                    conn.release();
                    callback(err, res);
                });
            }
        });
    }
}