echo "Removing existing assets..."
rm -rf static
rm -rf static-dev/css
rm -rf static-dev/js
rm -rf static-dev/admin

echo "Bundling CSS assets..."
npm run build:production:css
echo "CSS Bundled"

echo "Bundling JS assets..."
npm run build:production:js
echo "JS Bundled"

echo "Bundling React assets..."
npm run build:production:react
echo "React Bundled"

echo "Collecting Static files..."
python manage.py collectstatic --noinput -i admin
echo "Static files collected"