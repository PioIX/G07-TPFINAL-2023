
const mySql = require("mysql2/promise");

const SQL_CONFIGURATION_DATA =
{
	host: "10.1.5.205", // IP Privada
	// host: "186.18.137.196", // IP Pública 
	user: "2023_5INF_G07",
	password: "aSanLorenzolocorrimosenBoedo",
	database: "2023-5INF-G07",
	port: 3306,
	charset: 'UTF8_GENERAL_CI'
}

exports.realizarQuery = async function (queryString)
{
	let returnObject;
	let connection;
	try
	{
		connection = await mySql.createConnection(SQL_CONFIGURATION_DATA);
		returnObject = await connection.execute(queryString);
	}
	catch(err)
	{
		console.log(err);
	}
	finally
	{
		if(connection && connection.end) connection.end();
	}
	return returnObject[0];
}