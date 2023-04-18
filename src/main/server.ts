import { app, port } from './config/app'

app.listen(port, () => { console.log(`server running at http://localhost:${port}`) })
