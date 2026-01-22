# Bird (копия Twitter с микросервисами)

Этот проект — упрощенная версия Твиттера (X), созданная в учебных целях. Главная цель — разобраться на практике, как работают микросервисы, как их связывать и защищать.

Проект состоит из:
1.  **UMS (User Management Service)** — сервис пользователей, ролей и авторизации.
2.  **Twitter** — сервис для сообщений (твитов) и подписок.
3.  **Bird UI** — фронтенд на React.

**Что было сделано:**
*   Реализована **микросервисная архитектура**.
*   Настроена **база данных MySQL**.
*   **Добавлена защита (Security):** Внедрена авторизация через **JWT токены**. Сервисы общаются безопасно, используя общий секретный ключ и Token Relay
*   Написан **UI клиент**.


## Запуск приложения

### Способ 1: Локальный запуск (Docker + Gradle + NPM)

Простой способ поднять всё на своей машине (как среду разработки)

**Требования:** **JDK 21+**, **Docker** (для базы данных), **Node.js 20** (для фронтенда), **Gradle 8**

#### 1. Клонировать репозиторий
```shell
git clone 
cd bird
```

#### 2. База Данных (MySQL)
Запустить контейнер с MySQL

```shell
docker run -e MYSQL_ROOT_PASSWORD=passw \
-d --name bird \
-v bird-db-data:/var/lib/mysql \
-v $(pwd)/database:/database \
-p 3306:3306 \
mysql:latest
```

Создать базы данных и таблицы, добавить тестовые данные:

```shell
docker exec -it bird mysql -u root -ppassw -e "create database ums; create database twitter;"

# Структура и данные для UMS
docker exec -it bird mysql -u root -ppassw -e "use ums; source /database/ums.sql"

# Структура и данные для Twitter
docker exec -it bird mysql -u root -ppassw -e "use twitter; source /database/twitter.sql"
```

#### 3. Сборка и запуск Бэкенд-сервисов (Java)

Нужно запустить два jar-файла в разных терминалах

**Терминал 1 (UMS Service - порт 9000):**
```shell
cd ums
gradle build
cd build/libs
java -jar ums-1.3.jar
```

**Терминал 2 (Twitter Service - порт 9001):**
```shell
cd twitter
gradle build
cd build/libs
java -jar twitter-1.3.jar
```

#### 4. Запуск frontend-а (React)

**Терминал 3 (UI):**
```shell
cd bird-ui
npm install
npm run dev
```
Фронтенд запускается на `http://localhost:5173`

### Способ 2: Запуск в Kubernetes (Minikube)

Сценарий развертывания кластера Minikube с Ingress контроллером

**Требования:** Minikube, Kubectl, Docker.

#### 1. Подготовка кластера
Запускаем Minikube с драйвером docker и включаем Ingress.
```bash
minikube start --cpus=2 --memory=4096 --driver=docker
minikube addons enable ingress
```

#### 2. Сборка приложений
Мы собираем JAR-файлы на хосте, а Docker-образы строим внутри контекста Minikube, чтобы кластер их видел.

```bash
# Сборка JAR
cd ums && gradle build && cd ..
cd twitter && gradle build && cd ..

# Переключение на Docker-демон внутри Minikube
eval $(minikube docker-env)

# Сборка образов
docker build -t bird-ums:1.3 ./ums
docker build -t bird-twitter:1.3 ./twitter
docker build -t bird-ui:2.0 ./bird-ui
```

#### 3. Внедрение Istio (Service Mesh)
Если Istio не установлен, установите его (`istioctl install --set profile=demo`).
Активируем автоматическую инъекцию sidecar-прокси:
```bash
kubectl label namespace default istio-injection=enabled
```

#### 4. Деплой ресурсов
Применяем манифесты из папки `k8s`
*   `mysql-external.yaml`: Сервис для доступа к внешней БД на хосте (IP шлюза 192.168.49.1).
*   `istio-rules.yaml`: ServiceEntry для разрешения исходящего трафика к БД.
*   `ums-app.yaml`, `twitter-app.yaml`: Деплойменты бэкенда.
*   `ui-app.yaml`: Деплоймент фронтенда.
*   `ingress.yaml`: Правила маршрутизации (`/ums`, `/twitter`, `/`).

```bash
kubectl apply -f k8s/
```

#### 5. Доступ к приложению
Для тестирования работы кластера (вместо настройки load balancer-ов). 

**Запуск туннеля (в отдельном окне):**
Требует прав администратора (`sudo`), так как создает сетевой интерфейс.
```bash
minikube tunnel
```

**Настройка DNS:**
Узнайте внешний IP, который получил Ingress, или используйте `127.0.0.1` (если работаете с туннелем). 
Добавьте запись в hosts вашей системы:

```text
127.0.0.1 bird.local
```
*(Если minikube tunnel выдал другой IP, используйте его вместо 127.0.0.1)*

Далее используйте домен bird.local

### Тестирование

Если всё запущено корректно, приложение доступно в браузере по адресу: **http://localhost:5173** или **http://bird.local**

*   **Postman/Hoppscotch:** Коллекции запросов находятся в папке `requests`.
*   **Тестовый аккаунт:** Email: `angela@merkel.de` / Pass: `password`.