import { pinus } from 'pinus';
import { preload } from './preload';
import {MysqlMgr} from './app/mysql/mysqlMgr';
import {AreaServerLoader} from './app/config/ServerLoader';
import ConfigLoader from './app/config/ConfigLoader';
import {SceneMgr} from "./app/domain/scene/SceneMgr";
import PlayerFilter from "./app/servers/scene/filter/PlayerFilter";


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
            heartbeat: 60,
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
    //app.set('areaService', new AreaService());
    app.set('sceneMgr', new SceneMgr());
    app.before(PlayerFilter());
});

// app configure
app.configure('production|development', function () {

    app.enable('systemMonitor'); //允许监控

    // route configures
    // app.route('chat', routeUtil.chat);

    app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
    // filter configures
    app.filter(new pinus.filters.timeout());
});

// Configure database
app.configure('production|development', 'area|auth|connector|master', function() {
    app.set('dbclient', new MysqlMgr(app));
});

app.configure('production|development', 'area|connector', function() {
    ConfigLoader.instance.loadAllConfig(new AreaServerLoader(), null);
});


// start app
app.start();

