

# 📌 Gestion des Talents en Entreprise  
## 🏢 Application Web pour la Gestion des Talents et des Évaluations des Employés  

## 📖 Description  
Cette application permet aux entreprises de gérer les services, postes, employés et leurs compétences. Elle facilite l’évaluation des employés, génère des statistiques et aide à la prise de décisions RH.  

- 🖥 **Frontend** : Angular  
- ⚙ **Backend** : Spring Boot  
- 🗄 **Base de données** : MySQL  

---

## 📂 Structure du Projet

Hrmaps-PFE/

│── back/     --> (Spring Boot - MySQL)

│── front/    --> (Angular)

│── README.md    --> (Ce fichier)


---

## 🚀 Installation et Exécution  
### 📌 Pré-requis  
- **Node.js** (v18+) & **Angular CLI**  
- **Java 21** & **Spring Boot**  
- **MySQL**  

---

### 🛠 1️⃣ Installation Backend (Spring Boot)  
#### 🔹 1. Cloner le projet  
```bash
git clone https://github.com/ton-utilisateur/HrMaps.git
cd HrMaps/back
```
#### 🔹 2. Configurer MySQL  
Créer une base de données MySQL :  
```sql
CREATE DATABASE HrMaps;
```
#### 🔹 3. Configurer `application.properties`  
Modifier `src/main/resources/application.properties` :  
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/HrMaps?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=ton_mdp
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
server.port=8085
```
#### 🔹 4. Lancer le backend  
```bash
mvn spring-boot:run
```
L’API sera accessible à `http://localhost:8085`.

---

### 🎨 2️⃣ Installation Frontend (Angular)  
#### 🔹 1. Accéder au dossier frontend  
```bash
cd ../frontend
```
#### 🔹 2. Installer les dépendances  
```bash
npm install
```
#### 🔹 3. Lancer l’application Angular  
```bash
ng serve --open
```
L’application sera accessible à `http://localhost:4200`.

---

## 📊 Fonctionnalités Principales  
✅ **Gestion des utilisateurs (RH, Employés, Chefs d’équipe)**  
✅ **Création et gestion des services et postes**  
✅ **Affectation des employés aux postes avec leurs compétences**  
✅ **Évaluation des employés selon leurs compétences**  
✅ **Calcul automatique des moyennes des notes attribuées**  
✅ **Affichage des statistiques sous forme de graphiques**  
✅ **Comparaison des employés par postes et compétences (Graphiques en barres)**  
✅ **Historique des notes attribuées aux compétences des employés**  
🔲 **Génération automatique de plans de carrière**  
🔲 **Génération de fiches de paie (salaires, primes, etc.)**  
 

---

## 🤝 Contributeurs  
- **Hamza Smati** *(Développeur Full Stack)*  

---

## ⚖ Licence  
Ce projet est sous licence **MIT**. Tu es libre de l’utiliser et le modifier. 🚀  
```

✅ **Fichier prêt à être copié/collé dans README.md** ✅
