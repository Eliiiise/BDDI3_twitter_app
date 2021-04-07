# BDDI3_twitter_app

## Introduction

Cette application a été développer durant un cour d'initiation à NodeJs. Elle permet de voir en temps réel le champ lexical le plus utilisé par les tweets entre celui de l'amour et celui de la haine.

Le but pour l'utilisateur est de faire gagner le champ lexical de l'amour. Pour cela, il doit sélectionner 3 mots en rapport avec l'amour qu'il pense être les plus utilisés sur Twitter.

## Mise en place du projet

Installation des dépendances :

```bash
$ npm install
```

Créer le .env à partir du .env.example

Lancer le projet :

```bash
$ npm start
```

Se rendre sur [localhost:3000](http://localhost:3000)

## Le Projet

Ce projet utilise NodeJs pour sa capacité à gérer une multitude de connexion au serveur et ainsi de gérer plusieurs requêtes de manière asynchrone. Cela permet d'obtenir une application fluide et capable de gérer une plusieurs clients. 

Websocket permet de connecter le client et le serveur et ainsi pouvoir afficher les données et créer l'interaction avec l'utilisateur.

## Problèmes rencontrés

Les latences de l'api Twitter lors de changement de filtre mon posé quelques problèmes :

Lorsque l'utilisateur sélectionne un mot celui-ci doit directement être pris en compte dans l'application. 
Pour réaliser cela, j'avais prévu initialement de mettre à jour les filtres à chaque sélection de mot de l'utilisateur. Je n'ai pas pu garder cette solution car l'application mettait quelques secondes à prendre en compte l'action de l'utilisateur. J'ai donc choisi d'activer tous les filtres des mots que pouvait choisir l'utilisateur, mais de comptabiliser uniquement ceux qui étaient sélectionné.  
