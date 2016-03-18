describe( 'DisplayPort', function() {
    describe( '#constructor', function() {
        it( 'Should fail if no display manager is provided.', function() {
            //var invalid = {};

            expect(function() {
                new DisplayPort()
            }).to.throw(Error);

            expect(function() {
                var temp = {};
                new DisplayPort( temp )
            }).to.throw(Error);
        });

        it( 'Should succeed when a display manager is supplied.', function() {
            expect(function() {
                var parent = new DisplayManager();
                new DisplayPort( parent )
            }).to.not.throw(Error);
        });
    });
});