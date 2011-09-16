//
//  Appcelerator Titanium Mobile
//  WARNING: this is a generated file and should not be modified
//

#import <UIKit/UIKit.h>
#define _QUOTEME(x) #x
#define STRING(x) _QUOTEME(x)

NSString * const TI_APPLICATION_DEPLOYTYPE = @"test";
NSString * const TI_APPLICATION_ID = @"edu.ucsd.ucsandiego";
NSString * const TI_APPLICATION_PUBLISHER = @"UC San Diego -- Campus Web Office";
NSString * const TI_APPLICATION_URL = @"http://m.ucsd.edu/";
NSString * const TI_APPLICATION_NAME = @"UCSanDiego";
NSString * const TI_APPLICATION_VERSION = @"3.5";
NSString * const TI_APPLICATION_DESCRIPTION = @"Official mobile app of UC San Diego";
NSString * const TI_APPLICATION_COPYRIGHT = @"2011 by Regents of the University of California";
NSString * const TI_APPLICATION_GUID = @"43a04013-9af3-4d78-b223-fbc6a566b287";
BOOL const TI_APPLICATION_ANALYTICS = true;

#ifdef TARGET_IPHONE_SIMULATOR
NSString * const TI_APPLICATION_RESOURCE_DIR = @"";
#endif

int main(int argc, char *argv[]) {
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];

#ifdef __LOG__ID__
	NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
	NSString *documentsDirectory = [paths objectAtIndex:0];
	NSString *logPath = [documentsDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"%s.log",STRING(__LOG__ID__)]];
	freopen([logPath cStringUsingEncoding:NSUTF8StringEncoding],"w+",stderr);
	fprintf(stderr,"[INFO] Application started\n");
#endif

	int retVal = UIApplicationMain(argc, argv, nil, @"TiApp");
    [pool release];
    return retVal;
}
