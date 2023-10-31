Documentation for CPSC 349 Project 1


The project uses PostgreSQL for it’s database, download it here. Make sure to also include pgAdmin with the installation when prompted
Open up pgAdmin, and create a new database titled “users”. 
![alt text](https://keep.google.com/u/1/media/v2/1diUX57S2_IVPtf3nvLU5bIHeq5e_LA6pqCSBChIipZCcVt3hyxmCkB3MbZA/1rBOqdb0evMtH3hgbHOvJR32H-Op1wAzF3ZK3tc4tXrLc91pnKLOct3zNtU4FoA?sz=512&accept=image%2Fgif%2Cimage%2Fjpeg%2Cimage%2Fjpg%2Cimage%2Fpng%2Cimage%2Fwebp)



Download IntelliJ (Java IDE) here
Git clone the Github repository from this link, and open the “demo” folder with IntelliJ. The root directory should look like the image below in IntelliJ.
![alt text](https://keep.google.com/u/1/media/v2/1QSPZoEEsWGxQeh4sWbvSPaCCPHXCnNCUdx1eK_jnzYd-B_wnkRtQ51to0_D9Yw/1bGG3su-IIyukJV0dz8TW82pOJ7ty0KAMBVgEfz-J6hjFaNdaw43a8xYAPGwvols?sz=512&accept=image%2Fgif%2Cimage%2Fjpeg%2Cimage%2Fjpg%2Cimage%2Fpng%2Cimage%2Fwebp)

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


