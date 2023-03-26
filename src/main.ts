import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('Mgo+DSMBaFt/QHNqVVhkW1pFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF9iSHxSdERmW39WdnJdQQ==;Mgo+DSMBPh8sVXJ0S0V+XE9AcVRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS3xSd0diW35bcnRdQGdUVg==;ORg4AjUWIQA/Gnt2VVhjQlFaclhJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0RhWH1fdXZVTmZUWUM=;NzY1NTU1QDMyMzAyZTMzMmUzMFNMUDhpT3dIZXkwZVo0aXZ6b25WZjFyVmFMNjJEanBzbHpoME5XMVVMOWM9;NzY1NTU2QDMyMzAyZTMzMmUzMGthU3BsY1FhR1RCQTJZdU1oY0VzUVJRdFlzczQxUGJqeFFDbTFHcFVEZVk9;NRAiBiAaIQQuGjN/V0Z+X09EaFtFVmJLYVB3WmpQdldgdVRMZVVbQX9PIiBoS35RdERiW35ccXFXRmhbVUJx;NzY1NTU4QDMyMzAyZTMzMmUzMEI3cXFCQVhCb09WYTJBQmVGNy9Ud3phT1grZVRJWHZwWUtqR2crNERrM009;NzY1NTU5QDMyMzAyZTMzMmUzMGx3MnFyQTRGS092YVFKS283YXovenJuMTJjQWN2ZkRueHUrcDBwdG5GbkE9;Mgo+DSMBMAY9C3t2VVhjQlFaclhJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0RhWH1fdXZVTmhcV0M=;NzY1NTYxQDMyMzAyZTMzMmUzMG5wNXhUZ21JSklQa3lxMXNkRzN3RTRtYjlsck54OTlveG51c3loejVWc0U9;NzY1NTYyQDMyMzAyZTMzMmUzMEdNY2NseUU3RW5TcXYzZDBaMXBmSUNYL0NrbEZ5L2RlcWJnMmFXaGUwZkk9;NzY1NTYzQDMyMzAyZTMzMmUzMEI3cXFCQVhCb09WYTJBQmVGNy9Ud3phT1grZVRJWHZwWUtqR2crNERrM009');


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
