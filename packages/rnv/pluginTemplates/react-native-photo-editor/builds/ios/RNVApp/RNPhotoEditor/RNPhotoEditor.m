
#import "RNPhotoEditor.h"

@implementation RNPhotoEditor

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

NSString *_editImagePath = nil;

RCTResponseSenderBlock _onDoneEditing = nil;
RCTResponseSenderBlock _onCancelEditing = nil;

- (void)doneEditingWithImage:(UIImage *)image {
    if (_onDoneEditing == nil) return;

    // Save image.
    NSString *newImagePath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask,YES) firstObject];
    NSString *fileName = [[_editImagePath componentsSeparatedByString:@"/"].lastObject componentsSeparatedByString:@"."].firstObject;
    fileName = [fileName stringByAppendingString:@".png"];
    newImagePath = [newImagePath stringByAppendingPathComponent:fileName];
    [UIImagePNGRepresentation(image) writeToFile:newImagePath atomically:YES];

    _onDoneEditing(@[newImagePath]);
}

- (void)canceledEditing {
    if (_onCancelEditing == nil) return;

    _onCancelEditing(@[]);
}

RCT_EXPORT_METHOD(Edit:(nonnull NSDictionary *)props onDone:(RCTResponseSenderBlock)onDone onCancel:(RCTResponseSenderBlock)onCancel) {

    dispatch_async(dispatch_get_main_queue(), ^{
        _editImagePath = [props objectForKey: @"path"];

        _onDoneEditing = onDone;
        _onCancelEditing = onCancel;

        PhotoEditorViewController *photoEditor = [[PhotoEditorViewController alloc] initWithNibName:@"PhotoEditorViewController" bundle: [NSBundle bundleForClass:[PhotoEditorViewController class]]];

        // Process Image for Editing
        UIImage *image = [UIImage imageWithContentsOfFile:_editImagePath];
        if (image == nil) {
            NSURL *url = [NSURL URLWithString:_editImagePath];
            NSData *data = [NSData dataWithContentsOfURL:url];

            image = [UIImage imageWithData:data];
        }

        photoEditor.image = image;

        // Process Stickers
        NSArray *stickers = [props objectForKey: @"stickers"];
        NSMutableArray *imageStickers = [[NSMutableArray alloc] initWithCapacity:stickers.count];

        for (NSString *sticker in stickers) {
            NSString *stickerFile = [sticker stringByAppendingString:@".png"];
            UIImage *image = [UIImage imageNamed: stickerFile];
            if(image){
                [imageStickers addObject: image];
            }
        }

        photoEditor.stickers = imageStickers;

        //Process Controls
        NSArray *hiddenControls = [props objectForKey: @"hiddenControls"];
        NSMutableArray *passHiddenControls = [[NSMutableArray alloc] initWithCapacity:hiddenControls.count];

        for (NSString *hiddenControl in hiddenControls) {
            [passHiddenControls addObject: [[NSString alloc] initWithString: hiddenControl]];
        }

        photoEditor.hiddenControls = passHiddenControls;

        //Process Colors
        NSArray *colors = [props objectForKey: @"colors"];
        NSMutableArray *passColors = [[NSMutableArray alloc] initWithCapacity:colors.count];

        for (NSString *color in colors) {
            [passColors addObject: [self colorWithHexString: color]];
        }

        photoEditor.colors = passColors;

        if (@available(iOS 13, *)) {
           [photoEditor setModalPresentationStyle: UIModalPresentationFullScreen];
        }

        // Invoke Editor
        photoEditor.photoEditorDelegate = self;

        id<UIApplicationDelegate> app = [[UIApplication sharedApplication] delegate];
        [((UINavigationController*) app.window.rootViewController) presentViewController:photoEditor animated:YES completion:nil];
    });
}


- (CGFloat) colorComponentFrom: (NSString *) string start: (NSUInteger) start length: (NSUInteger) length {
    NSString *substring = [string substringWithRange: NSMakeRange(start, length)];
    NSString *fullHex = length == 2 ? substring : [NSString stringWithFormat: @"%@%@", substring, substring];
    unsigned hexComponent;
    [[NSScanner scannerWithString: fullHex] scanHexInt: &hexComponent];
    return hexComponent / 255.0;
}

- (UIColor *) colorWithHexString: (NSString *) hexString {
    NSString *colorString = [[hexString stringByReplacingOccurrencesOfString: @"#" withString: @""] uppercaseString];
    CGFloat alpha, red, blue, green;
    switch ([colorString length]) {
        case 3: // #RGB
            alpha = 1.0f;
            red   = [self colorComponentFrom: colorString start: 0 length: 1];
            green = [self colorComponentFrom: colorString start: 1 length: 1];
            blue  = [self colorComponentFrom: colorString start: 2 length: 1];
            break;
        case 4: // #ARGB
            alpha = [self colorComponentFrom: colorString start: 0 length: 1];
            red   = [self colorComponentFrom: colorString start: 1 length: 1];
            green = [self colorComponentFrom: colorString start: 2 length: 1];
            blue  = [self colorComponentFrom: colorString start: 3 length: 1];
            break;
        case 6: // #RRGGBB
            alpha = 1.0f;
            red   = [self colorComponentFrom: colorString start: 0 length: 2];
            green = [self colorComponentFrom: colorString start: 2 length: 2];
            blue  = [self colorComponentFrom: colorString start: 4 length: 2];
            break;
        case 8: // #AARRGGBB
            alpha = [self colorComponentFrom: colorString start: 0 length: 2];
            red   = [self colorComponentFrom: colorString start: 2 length: 2];
            green = [self colorComponentFrom: colorString start: 4 length: 2];
            blue  = [self colorComponentFrom: colorString start: 6 length: 2];
            break;
        default:
            return nil;
    }
    return [UIColor colorWithRed: red green: green blue: blue alpha: alpha];
}


@end
