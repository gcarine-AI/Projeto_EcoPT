import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  'https://azhjqlrcydmyaanaiywx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aGpxbHJjeWRteWFhbmFpeXd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEyNDY1MiwiZXhwIjoyMDg5NzAwNjUyfQ.EpyGPVaBN3eG0DOcBimwCGr9itNy32xKmZ-lrU1EJlU'
  
)

export default supabase
