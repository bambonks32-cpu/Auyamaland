/* The site's settings. Edit the values between quotes.
   With supabase_anon_key empty the site runs on example data (a demo), which is how the preview works. */
window.AUY_CONFIG = {
  /* Supabase dashboard > Project Settings > API: the Project URL and the anon (public) key. NEVER the service key. */
  supabase_url: 'https://tvrmzyxhmktjoymmsusk.supabase.co',
  supabase_anon_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cm16eXhobWt0am95bW1zdXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NDE3MjQsImV4cCI6MjEwNzAxNzcyNH0.0SOnabohd5QoVDtpYMhwhFt-h53bD8OpKhaWt_jqCeA',
  /* the email_domain line of the server's supabase.txt */
  email_domain: 'players.auyamaland.invalid',

  /* what players type in Minecraft's multiplayer list; shown in the install guide */
  server_address: '',

  /* the season's clock (Venezuela) */
  time_zone: 'America/Caracas',

  /* the map: false draws blank parchment under the announced places (nothing on it pretends to be the real world);
     true draws invented terrain, as in the samples. */
  invented_terrain: false
};
