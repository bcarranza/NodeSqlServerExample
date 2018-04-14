var express = require('express'); //framework de node js
var app = express();
var sql = require('mssql');

var sqlConfig={
    user:'sa',
    password:'1234',
    server:'DESKTOP-N5PCTRA',
    database:'AdventureWorks2014',
    options: {
      instanceName: 'devbc'
    }
}

//start app in 8081
var server= app.listen(8081,function(){
  var host= server.address().address
  var port= server.address().port
  console.log("app listening at http://%s:%s", host, port)
});

//config endpoints
//1. Top 10 : Mas ordenes de compra realizadas por cliente
app.get('/sales/top/qty', function(req,res){
  const queryStr="SELECT top 10 c.CustomerID, \
               p.FirstName + ' ' + p.LastName as FULLNAME,  \
               SUM(TotalDue) as TOTAL, \
               SUM(TaxAmt) AS TAX, COUNT(1) AS QTY_SALESORDER \
               FROM Sales.SalesOrderHeader soh \
               inner join Sales.Customer c on soh.CustomerID=c.CustomerID \
               inner join Person.Person p on c.CustomerID=p.BusinessEntityID \
               group by c.CustomerID,p.FirstName + ' ' + p.LastName  \
               order by QTY_SALESORDER desc";

        console.log(queryStr);
        //connect to database
      sql.connect(sqlConfig, function(err){
          if(err) console.log(err);
          var request= new sql.Request();
          request.query(queryStr, function(err,recordset){
            if(err) console.log(err)
            res.send(recordset);
            sql.close();
          });
      });
});

//2. Top 10 : Mas dinero invertido por cliente
app.get('/sales/top/money', function(req,res){
  const queryStr="SELECT top 10 c.CustomerID, \
               p.FirstName + ' ' + p.LastName as FULLNAME,  \
               SUM(TotalDue) as TOTAL, \
               SUM(TaxAmt) AS TAX, COUNT(1) AS QTY_SALESORDER \
               FROM Sales.SalesOrderHeader soh \
               inner join Sales.Customer c on soh.CustomerID=c.CustomerID \
               inner join Person.Person p on c.CustomerID=p.BusinessEntityID \
               group by c.CustomerID,p.FirstName + ' ' + p.LastName  \
               order by TOTAL desc";

        console.log(queryStr);
        //connect to database
      sql.connect(sqlConfig, function(err){
          if(err) console.log(err);
          var request= new sql.Request();
          request.query(queryStr, function(err,recordset){
            if(err) console.log(err)
            res.send(recordset);
            sql.close();
          });
      });
});

//3. Top 10 : Producto que mas dinero genera
app.get('/sales/top/products/money', function(req,res){
  const queryStr="select distinct top 10 p.Name as ProductName, SUM(UnitPrice) as Total, \
                    COUNT(1) as Qty \
                    from Sales.SalesOrderDetail sd \
                  inner join Production.Product p on sd.ProductID = p.ProductID \
                  group by  p.Name \
                  order by Total desc";

        console.log(queryStr);
        //connect to database
      sql.connect(sqlConfig, function(err){
          if(err) console.log(err);
          var request= new sql.Request();
          request.query(queryStr, function(err,recordset){
            if(err) console.log(err)
            res.send(recordset);
            sql.close();
          });
      });
});

//4. Top 10 : Producto que mas se vende
app.get('/sales/top/products/qty', function(req,res){
  const queryStr="select  distinct top 10 p.Name as ProductName, SUM(UnitPrice) as Total, \
                    COUNT(1) as Qty \
                    from Sales.SalesOrderDetail sd \
                  inner join Production.Product p on sd.ProductID = p.ProductID \
                  group by  p.Name \
                  order by Qty desc";

        console.log(queryStr);
        //connect to database
      sql.connect(sqlConfig, function(err){
          if(err) console.log(err);
          var request= new sql.Request();
          request.query(queryStr, function(err,recordset){
            if(err) console.log(err)
            res.send(recordset);
            sql.close();
          });
      });
});