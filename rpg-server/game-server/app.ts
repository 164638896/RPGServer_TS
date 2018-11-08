import { pinus } from 'pinus';
import { preload } from './preload';
import {AreaService} from './app/services/areaService';
import {MysqlMgr} from './app/mysql/mysqlMgr';
import {DataApi} from './app/util/dataApi';


/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
preload();

/**
 * Init app for client.
 */
let app = pinus.createApp();
app.set('name', 'rpg-server');

// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig',
        {
            connector: pinus.connectors.hybridconnector,
            heartbeat: 30,
            useDict: false,
            useProtobuf: false
        });
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig',
        {
            connector: pinus.connectors.hybridconnector,
            useProtobuf: false
        });
});

// Configure for area server
app.configure('production|development', 'area', function() {
    app.set('areaService', new AreaService());
});

// app configure
app.configure('production|development', function () {
    // route configures
    // app.route('chat', routeUtil.chat);

    app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
    // filter configures
    app.filter(new pinus.filters.timeout());
});

// Configure database
app.configure('production|development', 'area|auth|connector|master', function() {
    app.set('dbclient', new MysqlMgr(app));

    DataApi.getInstance().init();
});


// start app
app.start();

