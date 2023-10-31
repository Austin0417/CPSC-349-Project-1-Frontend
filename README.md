Documentation for CPSC 349 Project 1


The project uses PostgreSQL for it’s database, download it here. Make sure to also include pgAdmin with the installation when prompted
Open up pgAdmin, and create a new database titled “users”. 
![alt text](https://lh3.googleusercontent.com/keep-bbsk/AG3SVnCTOpxmk9JbtcPTrCNbuQM_zaV9K6N-FZufsJtKoQxGmKmBObyC36un5Qb2ko5UTfFyJSzCuZr8xTf-pjLtHzR1hZceermwZ88h-0WXgbhaRb6X=s512)



Download IntelliJ (Java IDE) here
Git clone the Github repository from this link, and open the “demo” folder with IntelliJ. The root directory should look like the image below in IntelliJ.
![alt text](https://lh3.googleusercontent.com/keep-bbsk/AG3SVnDuFSl4ekWjI4tFTbXGkewU0lrQ79dznZO4s3qA7sCF_R_05SExdyJPuV0JN2dhE7sRXFw7_Rf5-lpc-dpN2z3kyWfXfgva1Ga9Va__Q47AWVUT=s512)

Navigate to the application.properties file. From the demo root directory: src/main//resources/application.properties. Copy paste the following lines into the file:

spring.datasource.url = jdbc:postgresql://localhost:5432/users
spring.datasource.username = postgres
spring.datasource.password = {your PostgreSQL password}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

Make sure to replace the password with your own password that you set when first opening pgAdmin

Click run to start the Spring Boot backend.
Git clone the frontend code here
Open the directory with VSCode and go live with index.html. 


