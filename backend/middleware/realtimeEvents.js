// Middleware to emit real-time events after successful operations

export const emitTreeUpdate = (req, res, next) => {
  // Store original json method
  const originalJson = res.json;
  
  // Override json method to emit event after response
  res.json = function(data) {
    // Call original json method
    const result = originalJson.call(this, data);
    
    // Emit event if operation was successful
    if (data && data.success && global.realtimeController) {
      const { treeId } = req.params;
      const method = req.method;
      
      if (treeId && method === 'PUT') {
        // Tree updated
        global.realtimeController.broadcastTreeUpdate(
          treeId, 
          data.data, 
          'tree:updated'
        );
      } else if (method === 'POST' && data.data) {
        // New tree created
        const newTreeId = data.data._id || data.data.tree?._id;
        if (newTreeId) {
          global.realtimeController.broadcastTreeUpdate(
            newTreeId, 
            data.data, 
            'tree:created'
          );
        }
      }
    }
    
    return result;
  };
  
  next();
};

export const emitForestUpdate = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    const result = originalJson.call(this, data);
    
    if (data && data.success && global.realtimeController) {
      const { forestId } = req.params;
      const method = req.method;
      
      if (forestId && method === 'PUT') {
        // Forest updated
        global.realtimeController.broadcastForestUpdate(
          forestId, 
          data.data, 
          'forest:updated'
        );
      } else if (method === 'POST' && data.data) {
        // New forest created
        const newForestId = data.data._id || data.data.forest?._id;
        if (newForestId) {
          global.realtimeController.broadcastForestUpdate(
            newForestId, 
            data.data, 
            'forest:created'
          );
        }
      }
    }
    
    return result;
  };
  
  next();
};

export const emitImageUpload = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    const result = originalJson.call(this, data);
    
    if (data && data.success && data.data && data.data.images && global.realtimeController) {
      const { treeId } = req.params;
      
      // Emit image upload events
      data.data.images.forEach(image => {
        global.realtimeController.broadcastImageUpload(treeId, image);
      });
    }
    
    return result;
  };
  
  next();
};

export const emitSystemNotification = (type, message, audience = 'all') => {
  if (global.realtimeController) {
    global.realtimeController.broadcastSystemNotification({
      type,
      message,
      level: 'info'
    }, audience);
  }
};

export const emitUserActivity = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    const result = originalJson.call(this, data);
    
    // Log significant user activities
    if (data && data.success && req.user && global.realtimeController) {
      const { method, path } = req;
      const action = getActionFromRequest(method, path);
      
      if (action) {
        // Emit to admin users for monitoring
        global.io?.to('admin').emit('user:activity', {
          userId: req.user._id,
          user: {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName
          },
          action,
          path,
          method,
          timestamp: new Date()
        });
      }
    }
    
    return result;
  };
  
  next();
};

// Helper function to determine action type from request
function getActionFromRequest(method, path) {
  const pathSegments = path.split('/');
  const resource = pathSegments[2]; // /api/[resource]/...
  
  switch (method) {
    case 'POST':
      if (path.includes('/login')) return 'user_login';
      if (path.includes('/register')) return 'user_register';
      if (path.includes('/upload')) return 'image_upload';
      return `${resource}_create`;
    
    case 'PUT':
    case 'PATCH':
      return `${resource}_update`;
    
    case 'DELETE':
      return `${resource}_delete`;
    
    default:
      return null;
  }
}

// Middleware for Server-Sent Events (SSE) endpoints
export const setupSSE = (req, res, next) => {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:3000',
    'Access-Control-Allow-Credentials': 'true'
  });

  // Send initial connection event
  res.write('data: {"type":"connected","timestamp":"' + new Date().toISOString() + '"}\n\n');

  // Store client connection
  req.sseConnection = {
    write: (data) => {
      try {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error('SSE write error:', error);
      }
    },
    end: () => {
      try {
        res.end();
      } catch (error) {
        console.error('SSE end error:', error);
      }
    }
  };

  // Handle client disconnect
  req.on('close', () => {
    console.log('SSE client disconnected');
  });

  req.on('error', (error) => {
    console.error('SSE connection error:', error);
  });

  next();
};