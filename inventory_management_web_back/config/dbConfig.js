module.exports = {
    HOST: process.env.HOST,
    PORT_WEB: process.env.PORT_WEB,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB_WEB: "inventory_management_datas",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};