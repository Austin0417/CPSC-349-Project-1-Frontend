Documentation for CPSC 349 Project 1


The project uses PostgreSQL for it’s database, download it here. Make sure to also include pgAdmin with the installation when prompted
Open up pgAdmin, and create a new database titled “users”. 
![alt text](https://cdn.discordapp.com/attachments/362059855701475333/1169016494613610576/documentation_pic_1.png?ex=6553de73&is=65416973&hm=ce022cc0185ab5c5ba2fe82b18f41c09aab4c4d01beb8ceedfd02bc9c1be955d&)



Download IntelliJ (Java IDE) here
Git clone the Github repository from this link, and open the “demo” folder with IntelliJ. The root directory should look like the image below in IntelliJ.
![alt text](https://cdn.discordapp.com/attachments/362059855701475333/1169016494953336912/documentation_pic_2.png?ex=6553de73&is=65416973&hm=86443f0b30c857cc7620588ac194e82a59ff0f8e7c8b409751fd17e6a571368b&)

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


