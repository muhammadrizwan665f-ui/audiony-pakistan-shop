import { supabase } from './src/integrations/supabase/client';
async function search() {
  const { data: settings } = await supabase.from('site_settings').select('settings').single();
  console.log('Settings search:', JSON.stringify(settings).includes('language selector'));
  const { data: products } = await supabase.from('products').select('name, description, tagline');
  console.log('Products search:', JSON.stringify(products).includes('language selector'));
}
search();
