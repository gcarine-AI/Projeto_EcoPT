import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        env: {
            SUPABASE_URL:'https://azhjqlrx.supabase.co',
            SUPABASE_SERVICE_KEY:'eXBhYmFzZSIsInJlZiI6ImF6aGpxbHJjeWRteWFhbmFpeXd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEyNDY1MiwiZXhwIjoyMDg5NzAwNjUyfQ.EpyGPVaBN3eG0DOcBimwCGr9itNy32xKmZ-lrU1EJlU',
            PORT: '3000',
            FRONTEND_URL:'http://localhost:4200',
        },
        globals: true
    }
})